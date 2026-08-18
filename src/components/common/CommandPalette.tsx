import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Clock,
  Code2,
  FileText,
  FolderGit2,
  BarChart3,
  Flame,
  Settings,
  Share2,
  X,
  Sparkles,
  Sun,
  Moon,
  MapPin,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveTab,
    theme,
    toggleTheme,
    setTheme,
    openAddClassModal,
    setFocusModeOpen,
    openWhatsAppModalForDay,
    openCalendarModal,
    currentDay,
    timetable,
    tasks,
    assignments,
    notes,
    exams,
  } = useApp();

  const [search, setSearch] = useState('');

  // Keyboard shortcut listener Ctrl+K or Cmd+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        e.preventDefault();
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const close = () => {
    setCommandPaletteOpen(false);
    setSearch('');
  };

  const navActions = [
    {
      id: 'tab-dashboard',
      title: 'Dashboard (Home)',
      subtitle: "Overview, today's schedule, and daily goals",
      category: 'Navigation',
      icon: <BarChart3 className="h-4 w-4 text-blue-500" />,
      perform: () => {
        setActiveTab('dashboard');
        close();
      },
    },
    {
      id: 'tab-today',
      title: "Today's Schedule",
      subtitle: "Live class timeline, rooms, and today's routine",
      category: 'Navigation',
      icon: <Clock className="h-4 w-4 text-emerald-500" />,
      perform: () => {
        setActiveTab('today');
        close();
      },
    },
    {
      id: 'tab-timetable',
      title: 'Weekly Timetable',
      subtitle: 'Complete 5-day matrix of classes, labs & rooms',
      category: 'Navigation',
      icon: <Calendar className="h-4 w-4 text-blue-500" />,
      perform: () => {
        setActiveTab('timetable');
        close();
      },
    },
    {
      id: 'tab-study',
      title: 'Smart Study Planner & Pomodoro',
      subtitle: 'Focus sessions, countdown timer, and revision',
      category: 'Navigation',
      icon: <Sparkles className="h-4 w-4 text-purple-500" />,
      perform: () => {
        setActiveTab('study');
        close();
      },
    },
    {
      id: 'tab-assignments',
      title: 'Assignments & Lab Tasks',
      subtitle: 'Track deadlines, lab reports, and submissions',
      category: 'Navigation',
      icon: <FileText className="h-4 w-4 text-amber-500" />,
      perform: () => {
        setActiveTab('assignments');
        close();
      },
    },
    {
      id: 'tab-coding',
      title: 'Coding Practice & DSA Tracker',
      subtitle: 'LeetCode logs, problem solver, and daily streak',
      category: 'Navigation',
      icon: <Code2 className="h-4 w-4 text-blue-500" />,
      perform: () => {
        setActiveTab('coding');
        close();
      },
    },
    {
      id: 'tab-projects',
      title: 'Projects Tracker',
      subtitle: 'Software engineering builds & GitHub repos',
      category: 'Navigation',
      icon: <FolderGit2 className="h-4 w-4 text-emerald-500" />,
      perform: () => {
        setActiveTab('projects');
        close();
      },
    },
    {
      id: 'tab-notes',
      title: 'Academic Notes & Cheatsheets',
      subtitle: 'Formulas, lecture summaries, and markdown notes',
      category: 'Navigation',
      icon: <FileText className="h-4 w-4 text-indigo-500" />,
      perform: () => {
        setActiveTab('notes');
        close();
      },
    },
    {
      id: 'tab-exams',
      title: 'Exams & Revision Countdown',
      subtitle: 'Upcoming midterms, finals, and target scores',
      category: 'Navigation',
      icon: <GraduationCap className="h-4 w-4 text-purple-500" />,
      perform: () => {
        setActiveTab('exams');
        close();
      },
    },
    {
      id: 'tab-analytics',
      title: 'Productivity Analytics',
      subtitle: 'Weekly study breakdown & performance charts',
      category: 'Navigation',
      icon: <BarChart3 className="h-4 w-4 text-teal-500" />,
      perform: () => {
        setActiveTab('analytics');
        close();
      },
    },
    {
      id: 'tab-settings',
      title: 'Workspace Settings',
      subtitle: 'Batch, semester, study targets & custom logo',
      category: 'Navigation',
      icon: <Settings className="h-4 w-4 text-slate-500" />,
      perform: () => {
        setActiveTab('settings');
        close();
      },
    },
  ];

  const quickActions = [
    {
      id: 'action-focus',
      title: 'Start Fullscreen Zen Focus Room',
      subtitle: 'Distraction-free ambient timer and study synthesizer',
      category: 'Quick Action',
      icon: <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />,
      perform: () => {
        setFocusModeOpen(true);
        close();
      },
    },
    {
      id: 'action-calendar',
      title: 'Export Timetable to Google Calendar (.ICS)',
      subtitle: 'Sync all classes, labs and rooms to calendar',
      category: 'Quick Action',
      icon: <Calendar className="h-4 w-4 text-blue-500" />,
      perform: () => {
        openCalendarModal();
        close();
      },
    },
    {
      id: 'action-whatsapp',
      title: `Send ${currentDay}'s Rooms to WhatsApp`,
      subtitle: 'Formatted room schedule ready to share with batchmates',
      category: 'Quick Action',
      icon: <Share2 className="h-4 w-4 text-emerald-500" />,
      perform: () => {
        openWhatsAppModalForDay(currentDay);
        close();
      },
    },
    {
      id: 'action-add-class',
      title: 'Add New Class or Lab Slot',
      subtitle: 'Create custom timetable block for any weekday',
      category: 'Quick Action',
      icon: <Calendar className="h-4 w-4 text-blue-500" />,
      perform: () => {
        openAddClassModal(currentDay);
        close();
      },
    },
    {
      id: 'action-theme-toggle',
      title: `Toggle Theme (${theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'})`,
      subtitle: 'Change interface color appearance',
      category: 'Appearance',
      icon: theme === 'dark' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />,
      perform: () => {
        toggleTheme();
        close();
      },
    },
  ];

  // Dynamic search results for timetable classes
  const query = search.trim().toLowerCase();
  const matchedClasses = query
    ? timetable
        .filter(
          (c) =>
            c.subjectName.toLowerCase().includes(query) ||
            c.room.toLowerCase().includes(query) ||
            c.day.toLowerCase().includes(query) ||
            (c.faculty && c.faculty.toLowerCase().includes(query))
        )
        .slice(0, 4)
        .map((c) => ({
          id: `class-${c.id}`,
          title: `${c.subjectName} (${c.type})`,
          subtitle: `${c.day} • ${c.startTime}-${c.endTime} • Room: ${c.room || 'TBA'} ${c.faculty ? `• ${c.faculty}` : ''}`,
          category: 'Timetable Class',
          icon: <MapPin className="h-4 w-4 text-red-500" />,
          perform: () => {
            setActiveTab('timetable');
            close();
          },
        }))
    : [];

  // Dynamic search results for assignments
  const matchedAssignments = query
    ? assignments
        .filter((a) => a.title.toLowerCase().includes(query) || a.subjectName.toLowerCase().includes(query))
        .slice(0, 3)
        .map((a) => ({
          id: `assign-${a.id}`,
          title: a.title,
          subtitle: `${a.subjectName} • Due: ${a.dueDate} • Status: ${a.status}`,
          category: 'Assignment',
          icon: <FileText className="h-4 w-4 text-amber-500" />,
          perform: () => {
            setActiveTab('assignments');
            close();
          },
        }))
    : [];

  // Combined list
  const allItems = [...matchedClasses, ...matchedAssignments, ...quickActions, ...navActions];
  const filtered = query
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.subtitle?.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      )
    : [...quickActions, ...navActions];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={close} />

      {/* Palette Card */}
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3.5 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="h-5 w-5 text-blue-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes, rooms, tasks, pages, actions..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={close}
            className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No matching results found for "{search}"
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Try searching for "Operating Systems", "Room 8108", "Assignments", or "Focus"
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.perform}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Jump directly to any room, class, or assignment</span>
          <span className="font-mono text-[10px]">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
