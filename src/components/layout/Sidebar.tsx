import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  BrainCircuit,
  BookOpen,
  FileText,
  UserCheck,
  Code2,
  FolderKanban,
  StickyNote,
  GraduationCap,
  BarChart3,
  Settings,
  ChevronRight,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    profile,
    overallAttendancePercentage,
    assignments,
    exams,
    todayClasses,
  } = useApp();

  const pendingAssignmentsCount = assignments.filter(
    (a) => a.status !== 'Completed'
  ).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'today',
      label: "Today's Schedule",
      icon: CalendarCheck,
      badge: todayClasses.length > 0 ? todayClasses.length : undefined,
      badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    },
    { id: 'timetable', label: 'Weekly Timetable', icon: CalendarDays },
    { id: 'study', label: 'Smart Study Planner', icon: BrainCircuit },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: FileText,
      badge: pendingAssignmentsCount > 0 ? pendingAssignmentsCount : undefined,
      badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    },
    { id: 'coding', label: 'Coding Practice', icon: Code2 },
    { id: 'projects', label: 'Projects Tracker', icon: FolderKanban },
    { id: 'notes', label: 'Academic Notes', icon: StickyNote },
    {
      id: 'exams',
      label: 'Exams & Revision',
      icon: GraduationCap,
      badge: exams.length > 0 ? exams.length : undefined,
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
    },
    { id: 'analytics', label: 'Analytics & Stats', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl h-full transition-colors select-none">
      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Academic OS
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'dashboard' && activeTab === 'overview') ||
            (item.id === 'overview' && activeTab === 'dashboard');
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Student Profile Card */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        <div
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-3 rounded-xl p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60 transition group"
        >
          <img
            src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="Student"
            className="h-9 w-9 rounded-xl object-cover ring-2 ring-blue-500/30"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {profile.name}
              </h4>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="truncate">{profile.course}</span>
              <span>•</span>
              <span className="font-mono font-medium">Sem {profile.semester}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
