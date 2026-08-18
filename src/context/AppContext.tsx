import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Subject,
  TimetableClass,
  DailyTask,
  Assignment,
  Exam,
  Project,
  Note,
  CodingLog,
  StudySessionLog,
  NotificationItem,
  ActiveTab,
  DayOfWeek,
} from '../types';
import {
  defaultProfile,
  defaultSubjects,
  defaultTimetable,
  defaultDailyTasks,
  defaultAssignments,
  defaultExams,
  defaultProjects,
  defaultNotes,
  defaultCodingLogs,
  defaultStudySessions,
  defaultNotifications,
} from '../data/defaultData';
import { sounds } from '../utils/sound';

interface ToastInfo {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & Theme
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // Time & Simulation
  currentTime: Date;
  currentDay: DayOfWeek;
  simulatedDay: DayOfWeek | null;
  setSimulatedDay: (day: DayOfWeek | null) => void;
  simulatedTime: string | null;
  setSimulatedTime: (time: string | null) => void;
  isSimulating: boolean;
  resetSimulation: () => void;

  // Profile
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Subjects & Attendance
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  markAttendance: (subjectId: string, attended: boolean) => void;
  toggleSubjectTopic: (subjectId: string, topicId: string) => void;
  addSubjectTopic: (subjectId: string, topicName: string) => void;

  // Timetable
  timetable: TimetableClass[];
  addClass: (newClass: Omit<TimetableClass, 'id'>) => void;
  updateClass: (id: string, updates: Partial<TimetableClass>) => void;
  deleteClass: (id: string) => void;
  resetTimetable: () => void;
  resetAllData: () => void;

  // Daily Tasks / Planner
  tasks: DailyTask[];
  addTask: (task: Omit<DailyTask, 'id'>) => void;
  toggleTask: (id: string) => void;
  editTask: (id: string, updates: Partial<DailyTask>) => void;
  deleteTask: (id: string) => void;

  // Assignments
  assignments: Assignment[];
  addAssignment: (asg: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  // Exams
  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProjectTask: (projectId: string, taskId: string) => void;
  addProjectTask: (projectId: string, taskTitle: string) => void;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  // Coding & Study Logs
  codingLogs: CodingLog[];
  addCodingLog: (log: Omit<CodingLog, 'id'>) => void;
  deleteCodingLog: (id: string) => void;
  studySessions: StudySessionLog[];
  addStudySession: (session: Omit<StudySessionLog, 'id'>) => void;

  // Notifications & Modals
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp'>) => void;

  // Modals & Triggers
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
  focusModeOpen: boolean;
  setFocusModeOpen: (open: boolean) => void;
  whatsappModalOpen: boolean;
  setWhatsAppModalOpen: (open: boolean) => void;
  whatsAppModalOpen: boolean;
  closeWhatsAppModal: () => void;
  whatsappTargetDay: DayOfWeek;
  whatsAppDay: DayOfWeek;
  openWhatsAppModalForDay: (day: DayOfWeek) => void;
  classModalOpen: boolean;
  editingClass: TimetableClass | null;
  openAddClassModal: (defaultDay?: DayOfWeek) => void;
  openEditClassModal: (c: TimetableClass) => void;
  closeClassModal: () => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  calendarModalOpen: boolean;
  openCalendarModal: () => void;
  closeCalendarModal: () => void;

  // Helpers & Stats
  triggerConfetti: () => void;
  showToast: (title: string, message: string, type?: ToastInfo['type']) => void;
  toasts: ToastInfo[];
  removeToast: (id: string) => void;

  // Computed Values
  todayClasses: TimetableClass[];
  currentClass: TimetableClass | null;
  nextClass: TimetableClass | null;
  minutesUntilNextClass: number | null;
  overallAttendancePercentage: number;
  todayStudyMinutes: number;
  todayCodingMinutes: number;
  completedTasksCount: number;
  totalTasksCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DATA_VERSION = 'v4_2026_08';

function getInitial<T>(key: string, defaultVal: T): T {
  try {
    // If data version is old, return default values for timetable & subjects to ensure new updates reflect immediately
    const savedVersion = localStorage.getItem('studyos_data_version');
    if (savedVersion !== DATA_VERSION && (key === 'timetable' || key === 'subjects')) {
      return defaultVal;
    }
    const saved = localStorage.getItem(`studyos_${key}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
  }
  return defaultVal;
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & Theme
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return getInitial<'dark' | 'light'>('theme', 'dark');
  });

  // Time & Simulation
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [simulatedDay, setSimulatedDay] = useState<DayOfWeek | null>(null);
  const [simulatedTime, setSimulatedTime] = useState<string | null>(null);

  // Entities
  const [profile, setProfile] = useState<UserProfile>(() => getInitial('profile', defaultProfile));
  const [subjects, setSubjects] = useState<Subject[]>(() => getInitial('subjects', defaultSubjects));
  const [timetable, setTimetable] = useState<TimetableClass[]>(() => getInitial('timetable', defaultTimetable));
  const [tasks, setTasks] = useState<DailyTask[]>(() => getInitial('tasks', defaultDailyTasks));
  const [assignments, setAssignments] = useState<Assignment[]>(() => getInitial('assignments', defaultAssignments));
  const [exams, setExams] = useState<Exam[]>(() => getInitial('exams', defaultExams));
  const [projects, setProjects] = useState<Project[]>(() => getInitial('projects', defaultProjects));
  const [notes, setNotes] = useState<Note[]>(() => getInitial('notes', defaultNotes));
  const [codingLogs, setCodingLogs] = useState<CodingLog[]>(() => getInitial('codingLogs', defaultCodingLogs));
  const [studySessions, setStudySessions] = useState<StudySessionLog[]>(() => getInitial('studySessions', defaultStudySessions));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getInitial('notifications', defaultNotifications));

  // Modals & Layout
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return getInitial<boolean>('sidebar_collapsed', false);
  });
  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const [focusModeOpen, setFocusModeOpen] = useState(false);
  const [whatsappModalOpen, setWhatsAppModalOpen] = useState(false);
  const [whatsappTargetDay, setWhatsAppTargetDay] = useState<DayOfWeek>('Monday');
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<TimetableClass | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const openCalendarModal = () => setCalendarModalOpen(true);
  const closeCalendarModal = () => setCalendarModalOpen(false);

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('studyos_data_version', DATA_VERSION); }, []);
  useEffect(() => { localStorage.setItem('studyos_theme', JSON.stringify(theme)); }, [theme]);
  useEffect(() => { localStorage.setItem('studyos_sidebar_collapsed', JSON.stringify(sidebarCollapsed)); }, [sidebarCollapsed]);
  useEffect(() => { localStorage.setItem('studyos_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('studyos_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('studyos_timetable', JSON.stringify(timetable)); }, [timetable]);
  useEffect(() => { localStorage.setItem('studyos_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('studyos_assignments', JSON.stringify(assignments)); }, [assignments]);
  useEffect(() => { localStorage.setItem('studyos_exams', JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem('studyos_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('studyos_notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('studyos_codingLogs', JSON.stringify(codingLogs)); }, [codingLogs]);
  useEffect(() => { localStorage.setItem('studyos_studySessions', JSON.stringify(studySessions)); }, [studySessions]);
  useEffect(() => { localStorage.setItem('studyos_notifications', JSON.stringify(notifications)); }, [notifications]);

  // Apply dark class to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Live Clock Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (title: string, message: string, type: ToastInfo['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerConfetti = () => {
    sounds.playCelebration();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
    });
  };

  // Determine current day of week (taking simulation into account)
  const currentDay: DayOfWeek = useMemo(() => {
    if (simulatedDay) return simulatedDay;
    const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[currentTime.getDay()];
  }, [simulatedDay, currentTime]);

  const isSimulating = simulatedDay !== null || simulatedTime !== null;

  const resetSimulation = () => {
    setSimulatedDay(null);
    setSimulatedTime(null);
    showToast('Simulation Reset', 'Reverted to real-world live clock and date.', 'info');
  };

  // Effective time string in "HH:MM"
  const currentEffectiveTime = useMemo(() => {
    if (simulatedTime) return simulatedTime;
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }, [simulatedTime, currentTime]);

  const currentMinutesVal = useMemo(() => {
    const [h, m] = currentEffectiveTime.split(':').map(Number);
    return h * 60 + m;
  }, [currentEffectiveTime]);

  // Today's classes sorted by startTime
  const todayClasses = useMemo(() => {
    return timetable
      .filter((c) => c && c.day === currentDay)
      .sort((a, b) => (a?.startTime || '').localeCompare(b?.startTime || ''));
  }, [timetable, currentDay]);

  // Find Current & Next Class
  const { currentClass, nextClass, minutesUntilNextClass } = useMemo(() => {
    let curr: TimetableClass | null = null;
    let next: TimetableClass | null = null;
    let diffMinutes: number | null = null;

    for (const c of todayClasses) {
      if (!c.startTime || !c.endTime) continue;
      const [startH = 0, startM = 0] = c.startTime.split(':').map(Number);
      const [endH = 0, endM = 0] = c.endTime.split(':').map(Number);
      const startMin = startH * 60 + startM;
      const endMin = endH * 60 + endM;

      if (currentMinutesVal >= startMin && currentMinutesVal < endMin) {
        curr = c;
      } else if (currentMinutesVal < startMin && !next) {
        next = c;
        diffMinutes = startMin - currentMinutesVal;
      }
    }

    return {
      currentClass: curr,
      nextClass: next,
      minutesUntilNextClass: diffMinutes,
    };
  }, [todayClasses, currentMinutesVal]);

  // Attendance metrics
  const overallAttendancePercentage = useMemo(() => {
    const total = subjects.reduce((acc, s) => acc + s.totalClasses, 0);
    const attended = subjects.reduce((acc, s) => acc + s.attendedClasses, 0);
    if (total === 0) return 100;
    return Math.round((attended / total) * 1000) / 10;
  }, [subjects]);

  // Daily productivity stats
  const todayStr = useMemo(() => {
    return currentTime.toISOString().split('T')[0];
  }, [currentTime]);

  const todayStudyMinutes = useMemo(() => {
    return studySessions
      .filter((s) => s.date === todayStr)
      .reduce((acc, s) => acc + s.durationMinutes, 0);
  }, [studySessions, todayStr]);

  const todayCodingMinutes = useMemo(() => {
    return codingLogs
      .filter((c) => c.date === todayStr)
      .reduce((acc, c) => acc + c.minutes, 0);
  }, [codingLogs, todayStr]);

  const completedTasksCount = useMemo(() => {
    return tasks.filter((t) => t.completed).length;
  }, [tasks]);

  const totalTasksCount = tasks.length;

  // Actions
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    showToast('Profile Updated', 'Your settings have been saved.', 'success');
  };

  const addSubject = (newSub: Omit<Subject, 'id'>) => {
    const id = `sub-${Date.now()}`;
    setSubjects((prev) => [...prev, { ...newSub, id }]);
    showToast('Subject Added', `${newSub.name} created successfully.`, 'success');
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Subject Updated', 'Changes saved.', 'info');
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setTimetable((prev) => prev.filter((c) => c.subjectId !== id));
    showToast('Subject Deleted', 'Removed subject and linked timetable classes.', 'warning');
  };

  const markAttendance = (subjectId: string, attended: boolean) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === subjectId) {
          const newTotal = s.totalClasses + 1;
          const newAttended = attended ? s.attendedClasses + 1 : s.attendedClasses;
          return { ...s, totalClasses: newTotal, attendedClasses: newAttended };
        }
        return s;
      })
    );
    if (attended) {
      sounds.playBeep(659.25, 'sine', 0.1);
      showToast('Attendance Marked', 'Marked as Attended (+1)', 'success');
    } else {
      sounds.playBeep(330, 'triangle', 0.2);
      showToast('Attendance Marked', 'Marked as Absent', 'warning');
    }
  };

  const toggleSubjectTopic = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === subjectId) {
          const updatedSyllabus = s.syllabus.map((t) =>
            t.id === topicId ? { ...t, completed: !t.completed } : t
          );
          return { ...s, syllabus: updatedSyllabus };
        }
        return s;
      })
    );
  };

  const addSubjectTopic = (subjectId: string, topicName: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === subjectId) {
          const newTopic = { id: `top-${Date.now()}`, name: topicName, completed: false };
          return { ...s, syllabus: [...s.syllabus, newTopic] };
        }
        return s;
      })
    );
    showToast('Topic Added', 'New syllabus item added.', 'success');
  };

  // Timetable Actions
  const addClass = (newClass: Omit<TimetableClass, 'id'>) => {
    const id = `class-${Date.now()}`;
    setTimetable((prev) => [...prev, { ...newClass, id }]);
    showToast('Class Scheduled', `${newClass.subjectName} on ${newClass.day} added.`, 'success');
  };

  const updateClass = (id: string, updates: Partial<TimetableClass>) => {
    setTimetable((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Class Updated', 'Timetable slot modified.', 'info');
  };

  const deleteClass = (id: string) => {
    setTimetable((prev) => prev.filter((c) => c.id !== id));
    showToast('Class Removed', 'Class removed from timetable.', 'warning');
  };

  const resetTimetable = () => {
    setTimetable(defaultTimetable);
    setSubjects(defaultSubjects);
    showToast('Timetable Reset', 'Default Batch 25CAIBTCSB52 timetable restored.', 'info');
  };

  const resetAllData = () => {
    setProfile(defaultProfile);
    setSubjects(defaultSubjects);
    setTimetable(defaultTimetable);
    setTasks(defaultDailyTasks);
    setAssignments(defaultAssignments);
    setExams(defaultExams);
    setProjects(defaultProjects);
    setNotes(defaultNotes);
    setCodingLogs(defaultCodingLogs);
    setStudySessions(defaultStudySessions);
    setNotifications(defaultNotifications);
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    showToast('Factory Reset Complete', 'All StudyOS data restored to defaults.', 'warning');
  };

  // Tasks Actions
  const addTask = (task: Omit<DailyTask, 'id'>) => {
    const id = `task-${Date.now()}`;
    setTasks((prev) => [ { ...task, id }, ...prev ]);
    showToast('Task Created', task.title, 'success');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) {
            triggerConfetti();
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const editTask = (id: string, updates: Partial<DailyTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task Deleted', 'Item removed.', 'info');
  };

  // Assignment Actions
  const addAssignment = (asg: Omit<Assignment, 'id'>) => {
    const id = `asg-${Date.now()}`;
    setAssignments((prev) => [ { ...asg, id }, ...prev ]);
    showToast('Assignment Added', asg.title, 'success');
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Assignment Updated', 'Changes saved.', 'info');
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    showToast('Assignment Deleted', 'Removed from tracker.', 'warning');
  };

  // Exam Actions
  const addExam = (exam: Omit<Exam, 'id'>) => {
    const id = `exam-${Date.now()}`;
    setExams((prev) => [...prev, { ...exam, id }]);
    showToast('Exam Added', `${exam.title || exam.examName || 'Exam'} scheduled.`, 'success');
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    showToast('Exam Updated', 'Exam details updated.', 'info');
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    showToast('Exam Deleted', 'Exam removed.', 'warning');
  };

  // Projects Actions
  const addProject = (proj: Omit<Project, 'id'>) => {
    const id = `proj-${Date.now()}`;
    setProjects((prev) => [ { ...proj, id }, ...prev ]);
    showToast('Project Created', proj.title, 'success');
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Project Removed', 'Project deleted.', 'warning');
  };

  const toggleProjectTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedTasks = p.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          );
          const completedCount = updatedTasks.filter((t) => t.completed).length;
          const progressPercentage = updatedTasks.length > 0
            ? Math.round((completedCount / updatedTasks.length) * 100)
            : p.progressPercentage;
          return { ...p, tasks: updatedTasks, progressPercentage };
        }
        return p;
      })
    );
  };

  const addProjectTask = (projectId: string, taskTitle: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newTask = { id: `pt-${Date.now()}`, title: taskTitle, completed: false };
          const updatedTasks = [...p.tasks, newTask];
          const completedCount = updatedTasks.filter((t) => t.completed).length;
          const progressPercentage = Math.round((completedCount / updatedTasks.length) * 100);
          return { ...p, tasks: updatedTasks, progressPercentage };
        }
        return p;
      })
    );
  };

  // Notes Actions
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `note-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    setNotes((prev) => [{ ...note, id, createdAt: today, updatedAt: today }, ...prev]);
    showToast('Note Created', note.title, 'success');
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const today = new Date().toISOString().split('T')[0];
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: today } : n))
    );
    showToast('Note Saved', 'Changes persisted.', 'info');
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast('Note Deleted', 'Note removed.', 'warning');
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  // Coding & Study
  const addCodingLog = (log: Omit<CodingLog, 'id'>) => {
    const id = `cl-${Date.now()}`;
    setCodingLogs((prev) => [{ ...log, id }, ...prev]);
    triggerConfetti();
    showToast('Coding Logged', `+${log.minutes} mins of ${log.language}`, 'success');
  };

  const deleteCodingLog = (id: string) => {
    setCodingLogs((prev) => prev.filter((c) => c.id !== id));
  };

  const addStudySession = (session: Omit<StudySessionLog, 'id'>) => {
    const id = `ss-${Date.now()}`;
    setStudySessions((prev) => [{ ...session, id }, ...prev]);
    // Also increase subject study hours
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === session.subjectId) {
          const addedHours = Math.round((session.durationMinutes / 60) * 10) / 10;
          return { ...s, studyHours: Math.round((s.studyHours + addedHours) * 10) / 10 };
        }
        return s;
      })
    );
    triggerConfetti();
    showToast('Study Session Logged', `Recorded ${session.durationMinutes} mins! 🎉`, 'success');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const id = `notif-${Date.now()}`;
    const newItem: NotificationItem = {
      ...item,
      id,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [newItem, ...prev]);
    showToast(item.title, item.message, 'info');
  };

  // Modals
  const openWhatsAppModalForDay = (day: DayOfWeek) => {
    setWhatsAppTargetDay(day);
    setWhatsAppModalOpen(true);
  };

  const openAddClassModal = (defaultDay?: DayOfWeek) => {
    setEditingClass(null);
    if (defaultDay) {
      setEditingClass({
        id: '',
        day: defaultDay,
        startTime: '09:30',
        endTime: '10:30',
        subjectId: subjects[0]?.id || '',
        subjectName: subjects[0]?.name || '',
        type: 'Lecture',
        room: '3102-BL3-GF',
        faculty: '',
        batch: profile.batch,
      });
    }
    setClassModalOpen(true);
  };

  const openEditClassModal = (c: TimetableClass) => {
    setEditingClass(c);
    setClassModalOpen(true);
  };

  const closeClassModal = () => {
    setClassModalOpen(false);
    setEditingClass(null);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        toggleTheme,
        currentTime,
        currentDay,
        simulatedDay,
        setSimulatedDay,
        simulatedTime,
        setSimulatedTime,
        isSimulating,
        resetSimulation,
        profile,
        updateProfile,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        markAttendance,
        toggleSubjectTopic,
        addSubjectTopic,
        timetable,
        addClass,
        updateClass,
        deleteClass,
        resetTimetable,
        resetAllData,
        tasks,
        addTask,
        toggleTask,
        editTask,
        deleteTask,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        exams,
        addExam,
        updateExam,
        deleteExam,
        projects,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectTask,
        addProjectTask,
        notes,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        codingLogs,
        addCodingLog,
        deleteCodingLog,
        studySessions,
        addStudySession,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        addNotification,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        focusModeOpen,
        setFocusModeOpen,
        whatsappModalOpen,
        setWhatsAppModalOpen,
        whatsAppModalOpen: whatsappModalOpen,
        closeWhatsAppModal: () => setWhatsAppModalOpen(false),
        whatsappTargetDay,
        whatsAppDay: whatsappTargetDay,
        openWhatsAppModalForDay,
        classModalOpen,
        editingClass,
        openAddClassModal,
        openEditClassModal,
        closeClassModal,
        commandPaletteOpen,
        setCommandPaletteOpen,
        calendarModalOpen,
        openCalendarModal,
        closeCalendarModal,
        triggerConfetti,
        showToast,
        toasts,
        removeToast,
        todayClasses,
        currentClass,
        nextClass,
        minutesUntilNextClass,
        overallAttendancePercentage,
        todayStudyMinutes,
        todayCodingMinutes,
        completedTasksCount,
        totalTasksCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
