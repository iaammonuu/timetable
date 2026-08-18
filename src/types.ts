export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type ClassType = 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar' | 'Break';

export interface TimetableClass {
  id: string;
  day: DayOfWeek;
  startTime: string; // "09:30"
  endTime: string;   // "10:30"
  subjectId: string;
  subjectName: string;
  type: ClassType;
  room: string;
  faculty?: string;
  batch?: string;
  notes?: string;
}

export interface SubjectTopic {
  id: string;
  name: string;
  completed: boolean;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  color: string;
  totalClasses: number;
  attendedClasses: number;
  faculty: string;
  defaultRoom: string;
  credits: number;
  studyHours: number;
  syllabus: SubjectTopic[];
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface DailyTask {
  id: string;
  title: string;
  time?: string;
  durationMinutes?: number;
  completed: boolean;
  priority: TaskPriority;
  category: 'College' | 'Study' | 'Coding' | 'Routine' | 'Project' | 'Other';
  subjectId?: string;
  date: string; // YYYY-MM-DD
}

export type AssignmentStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: AssignmentStatus;
  estimatedHours: number;
  completionPercentage: number;
  submissionLink?: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  title?: string;
  examName?: string;
  date: string; // YYYY-MM-DD
  time: string; // "10:00 - 13:00"
  room?: string;
  syllabusPercentage?: number;
  preparationPercentage?: number;
  topicsCovered?: string[];
  totalMarks?: number;
  weightage?: string; // "30%"
}

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  category?: 'Web Development' | 'AI/ML' | 'Mobile App' | 'College Practical' | 'System Programming' | 'Other';
  description: string;
  status: 'In Progress' | 'Completed' | 'Planning' | 'Paused';
  progress?: number;
  progressPercentage?: number;
  deadline: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  notes?: string;
  tasks: ProjectTask[];
}

export interface Note {
  id: string;
  title: string;
  subjectId: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CodingLog {
  id: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  language: 'Python' | 'Java' | 'C++' | 'JavaScript' | 'SQL' | 'DSA' | 'AI/ML' | 'Web Development';
  problemsSolved: number;
  notes?: string;
}

export interface StudySessionLog {
  id: string;
  date: string;
  subjectId: string;
  topic: string;
  durationMinutes: number;
  mode: 'Pomodoro' | 'Deep Focus' | 'Deep Work' | 'Revision' | 'Practice';
}

export interface UserProfile {
  name: string;
  course: string;
  semester: string;
  batch: string;
  rollNumber?: string;
  whatsappNumber: string;
  dailyStudyTargetMinutes: number;
  dailyCodingTargetMinutes: number;
  minAttendancePercentage: number;
  onboardingCompleted?: boolean;
  avatarUrl?: string;
  logoUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'class' | 'assignment' | 'exam' | 'attendance' | 'study' | 'system';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export type ActiveTab =
  | 'overview'
  | 'dashboard'
  | 'timetable'
  | 'today'
  | 'study'
  | 'coding'
  | 'assignments'
  | 'attendance'
  | 'subjects'
  | 'notes'
  | 'exams'
  | 'projects'
  | 'analytics'
  | 'settings';

export type NavTab = ActiveTab;
