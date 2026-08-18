import React, { useState, useRef } from 'react';
import {
  Bell,
  Search,
  Moon,
  Sun,
  Flame,
  Clock,
  Sparkles,
  Share2,
  Calendar,
  Layers,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Camera,
  Upload,
  Trash2,
  User,
  Image as ImageIcon,
  Settings,
  X,
  Plus,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DayOfWeek } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentTime,
    currentDay,
    simulatedDay,
    setSimulatedDay,
    simulatedTime,
    setSimulatedTime,
    isSimulating,
    resetSimulation,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    setFocusModeOpen,
    openWhatsAppModalForDay,
    openCalendarModal,
    setCommandPaletteOpen,
    sidebarCollapsed,
    toggleSidebar,
    profile,
    updateProfile,
    showToast,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [timeWarperOpen, setTimeWarperOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const daysList: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Format live clock
  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const dateStr = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast('Image Too Large', 'Please select an image under 3MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          updateProfile({ avatarUrl: event.target.result });
          showToast('Avatar Updated', 'Profile picture updated successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    updateProfile({ avatarUrl: '' });
    showToast('Avatar Removed', 'Profile picture reset to default initials.', 'info');
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast('Image Too Large', 'Please select an image under 3MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          updateProfile({ logoUrl: event.target.result });
          showToast('Logo Updated', 'Custom header logo applied!', 'success');
          setLogoModalOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    updateProfile({ logoUrl: '' });
    showToast('Logo Reset', 'Header logo reset to default icon.', 'info');
    setLogoModalOpen(false);
  };

  const userInitials = profile.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ST';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 px-4 md:px-6 backdrop-blur-md transition-colors">
      {/* Hidden File Inputs for Avatar & Logo Uploads */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={logoInputRef}
        onChange={handleLogoFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Left: Recreated Brand & Search Section */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Brand Button & Logo Container */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="group flex items-center cursor-pointer select-none rounded-xl focus:outline-hidden"
            title="Go to Dashboard"
            aria-label="Go to Dashboard"
          >
            {/* Custom Logo Image or Gradient Icon */}
            {profile.logoUrl ? (
              <img
                src={profile.logoUrl}
                alt="App Logo"
                className="h-9 w-9 rounded-xl object-cover shadow-md border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
            )}
          </button>

          {/* Desktop Sidebar Navigation Toggle Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title={sidebarCollapsed ? "Expand Sidebar Menu" : "Collapse Sidebar Menu"}
            aria-label="Toggle Sidebar Navigation"
          >
            {sidebarCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Global Search / Command Bar Trigger Button */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 px-3 py-2 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all shadow-xs active:scale-[0.98]"
          title="Search (⌘K)"
        >
          <Search className="h-4 w-4 text-blue-500 shrink-0" />
          <span className="hidden sm:inline font-medium">Search...</span>
        </button>
      </div>

      {/* Center/Right: Live Clock, Time Simulation, Notification & Recreated Avatar Section */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Live Clock / Simulator Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTimeWarperOpen(!timeWarperOpen)}
            className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-all ${
              isSimulating
                ? 'border-amber-400/80 bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse'
                : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
            title="Click to test timetable at different times/days"
          >
            <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <div className="flex flex-col text-left leading-tight hidden xs:flex">
              <span className="font-semibold">
                {currentDay},{' '}
                {simulatedTime ||
                  timeStr.split(':').slice(0, 2).join(':') + ' ' + timeStr.slice(-2)}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {isSimulating ? 'Simulated Time' : dateStr}
              </span>
            </div>
            {isSimulating && (
              <span className="rounded bg-amber-500 px-1 py-0.2 text-[9px] font-bold text-white uppercase">
                Sim
              </span>
            )}
          </button>

          {/* Time Warper Dropdown */}
          {timeWarperOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900 dark:text-white">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span>Timetable Simulator</span>
                </div>
                {isSimulating && (
                  <button
                    type="button"
                    onClick={() => {
                      resetSimulation();
                      setTimeWarperOpen(false);
                    }}
                    className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                Test how the dashboard dynamically highlights classes, countdowns, and rooms on different days:
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Select Test Day:
                  </label>
                  <select
                    value={simulatedDay || ''}
                    onChange={(e) => setSimulatedDay((e.target.value as DayOfWeek) || null)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Use Real Day ({daysList[currentTime.getDay()]}) --</option>
                    {daysList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Quick Time Presets:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: '09:30 AM', val: '09:35' },
                      { label: '11:30 AM', val: '11:45' },
                      { label: '01:00 PM', val: '13:00' },
                      { label: '02:30 PM', val: '14:35' },
                      { label: '04:00 PM', val: '16:00' },
                      { label: '07:00 PM', val: '19:00' },
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => {
                          setSimulatedTime(p.val);
                          if (!simulatedDay) setSimulatedDay('Monday');
                        }}
                        className={`rounded-lg px-1.5 py-1 text-[11px] font-mono border transition-all ${
                          simulatedTime === p.val
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-semibold'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setTimeWarperOpen(false)}
                    className="w-full rounded-xl bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp Schedule Button */}
        <button
          type="button"
          onClick={() => openWhatsAppModalForDay(currentDay)}
          className="hidden md:flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all shadow-xs"
          title="Send today's rooms & timetable to WhatsApp 9334005518"
        >
          <Share2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden lg:inline">WhatsApp</span>
        </button>

        {/* Focus Mode Trigger */}
        <button
          type="button"
          onClick={() => setFocusModeOpen(true)}
          className="hidden sm:flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-all shadow-xs shadow-purple-500/20"
          title="Open distraction-free Pomodoro Focus Mode"
        >
          <Flame className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
          <span className="hidden lg:inline">Focus</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No new notifications 🎉
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.linkTab) setActiveTab(n.linkTab as any);
                        setNotifOpen(false);
                      }}
                      className={`pt-2 cursor-pointer rounded-xl p-2 transition ${
                        !n.read
                          ? 'bg-blue-50/70 dark:bg-blue-950/40'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          {n.type === 'class' && <Calendar className="h-4 w-4 text-blue-500" />}
                          {n.type === 'assignment' && <BookOpen className="h-4 w-4 text-amber-500" />}
                          {n.type === 'attendance' && <AlertCircle className="h-4 w-4 text-red-500" />}
                          {n.type === 'exam' && <CheckCircle2 className="h-4 w-4 text-purple-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 inline-block">
                            {n.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Mode Switch */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-700" />
          )}
        </button>

        {/* Recreated Profile Avatar & Photo Manager Section */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="group relative flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 p-0.5 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
            title="Profile, photo & settings"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Student Avatar"
                className="h-8 w-8 rounded-full object-cover shadow-xs"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xs">
                {userInitials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Profile Menu Popover with Upload & Remove Photo options */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 space-y-3">
              {/* Profile Overview */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="h-11 w-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                      {userInitials}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs hover:bg-blue-700"
                    title="Upload photo"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {profile.name || 'Student'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {profile.batch} • Sem {profile.semester}
                  </p>
                </div>
              </div>

              {/* Photo Upload & Remove Buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Avatar Image
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      avatarInputRef.current?.click();
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={!profile.avatarUrl}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('settings');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-3.5 w-3.5 text-slate-500" />
                    <span>Workspace Settings</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">⌘,</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLogoModalOpen(true);
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Customize Header Logo</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Header Logo Upload/Remove Modal */}
      {logoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Header Brand Logo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLogoModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Current Logo Preview */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt="Custom Logo"
                  className="h-16 w-16 rounded-2xl object-cover shadow-md border border-slate-200 dark:border-slate-600"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20">
                  <Sparkles className="h-8 w-8" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {profile.logoUrl ? 'Custom Header Logo Active' : 'Default Vector Emblem'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  PNG, JPG, or SVG up to 3MB
                </p>
              </div>
            </div>

            {/* Actions: Upload & Remove */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Logo</span>
              </button>

              <button
                type="button"
                onClick={handleRemoveLogo}
                disabled={!profile.logoUrl}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove Logo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
