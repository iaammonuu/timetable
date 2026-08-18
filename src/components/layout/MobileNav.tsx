import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  BrainCircuit,
  FileText,
  Menu,
  X,
  CalendarDays,
  BookOpen,
  UserCheck,
  Code2,
  FolderKanban,
  StickyNote,
  GraduationCap,
  BarChart3,
  Settings,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, profile, currentDay, openWhatsAppModalForDay } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard' as ActiveTab, label: 'Home', icon: LayoutDashboard },
    { id: 'today' as ActiveTab, label: 'Today', icon: CalendarCheck },
    { id: 'study' as ActiveTab, label: 'Study', icon: BrainCircuit },
    { id: 'assignments' as ActiveTab, label: 'Tasks', icon: FileText },
  ];

  const drawerTabs = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'today' as ActiveTab, label: "Today's Schedule", icon: CalendarCheck },
    { id: 'timetable' as ActiveTab, label: 'Weekly Timetable', icon: CalendarDays },
    { id: 'study' as ActiveTab, label: 'Smart Study Planner', icon: BrainCircuit },
    { id: 'assignments' as ActiveTab, label: 'Assignments', icon: FileText },
    { id: 'coding' as ActiveTab, label: 'Coding Practice', icon: Code2 },
    { id: 'projects' as ActiveTab, label: 'Projects Tracker', icon: FolderKanban },
    { id: 'notes' as ActiveTab, label: 'Academic Notes', icon: StickyNote },
    { id: 'exams' as ActiveTab, label: 'Exams & Revision', icon: GraduationCap },
    { id: 'analytics' as ActiveTab, label: 'Analytics & Stats', icon: BarChart3 },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Bottom Floating Bar on Mobile/Tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around shadow-lg">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeTab === tab.id ||
            (tab.id === 'dashboard' && activeTab === 'overview');
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* More Menu Trigger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </div>

      {/* Slide-out Mobile Navigation Drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto flex h-full w-4/5 max-w-sm flex-col bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Menu</h3>
                  <p className="text-[10px] text-slate-500">Batch {profile.batch}</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* WhatsApp Quick Action inside Drawer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  openWhatsAppModalForDay(currentDay);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 text-white font-medium text-xs shadow-xs"
              >
                <Share2 className="h-4 w-4" />
                Send Today's Rooms to WhatsApp
              </button>
            </div>

            {/* Drawer Navigation List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {drawerTabs.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeTab === item.id ||
                  (item.id === 'dashboard' && activeTab === 'overview');
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setDrawerOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center text-[11px] text-slate-500">
              {profile.name} • {profile.course}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
