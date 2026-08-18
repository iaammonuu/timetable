import React, { useState, useRef } from 'react';
import {
  User,
  Download,
  RotateCcw,
  Sliders,
  FileJson,
  Sun,
  Moon,
  Check,
  Palette,
  Eye,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap,
  Calendar,
  Code2,
  Phone,
  Hash,
  Clock,
  ShieldCheck,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    theme,
    setTheme,
    toggleTheme,
    resetTimetable,
    resetAllData,
    showToast,
  } = useApp();

  const [name, setName] = useState(profile.name);
  const [batch, setBatch] = useState(profile.batch);
  const [semester, setSemester] = useState(profile.semester);
  const [whatsapp, setWhatsapp] = useState(profile.whatsappNumber);
  const [studyTarget, setStudyTarget] = useState(profile.dailyStudyTargetMinutes);
  const [codingTarget, setCodingTarget] = useState(profile.dailyCodingTargetMinutes);
  const [minAttendance, setMinAttendance] = useState(profile.minAttendancePercentage);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      batch,
      semester,
      whatsappNumber: whatsapp,
      dailyStudyTargetMinutes: Number(studyTarget),
      dailyCodingTargetMinutes: Number(codingTarget),
      minAttendancePercentage: Number(minAttendance),
    });
    showToast('Preferences Saved', 'Student profile & goals updated successfully.', 'success');
  };

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
          showToast('Logo Updated', 'Custom app header logo applied!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    updateProfile({ logoUrl: '' });
    showToast('Logo Reset', 'Header logo reset to default icon.', 'info');
  };

  const handleExportJson = () => {
    const data = {
      profile,
      theme,
      exportedAt: new Date().toISOString(),
      app: 'STUDYOS',
      version: '2.0.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyOS_Backup_${profile.batch || 'CSE'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Export Complete', 'Downloaded backup configuration JSON.', 'success');
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    showToast(
      `${newTheme === 'dark' ? 'Dark' : 'Light'} Mode Active`,
      `Interface theme updated and persisted to your device.`,
      'info'
    );
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
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Hidden File Inputs */}
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

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            System &amp; Workspace Settings
          </h1>
          <span className="rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold text-xs px-2.5 py-0.5">
            Preferences
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure appearance theme, profile avatars, brand logo, academic targets, and data backups
        </p>
      </div>

      {/* 1. PROFILE & BRAND IMAGES SECTION (UPLOAD & REMOVE) */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-5 transition-all">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Camera className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Profile Avatar &amp; Header Logo Images
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Upload custom photos or remove them anytime to revert to default vector emblems
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Student Avatar Image */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Student Avatar
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {profile.avatarUrl ? 'Custom Image' : 'Initials Placeholder'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="h-16 w-16 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-800 ring-2 ring-blue-500/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-md">
                    {userInitials}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs hover:bg-blue-700 transition"
                  title="Upload avatar photo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {profile.name || 'Student Profile'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Displayed in navigation bar, headers, and academic summary.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <Upload className="h-3 w-3" />
                    <span>Upload Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={!profile.avatarUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Header Logo Image */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Header Brand Logo
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {profile.logoUrl ? 'Custom Logo' : 'Default Emblem'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt="App Logo"
                    className="h-16 w-16 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-800 ring-2 ring-indigo-500/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20">
                    <Sparkles className="h-7 w-7" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 transition"
                  title="Upload brand logo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  Workspace Brand Logo
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Custom university or personal emblem shown in the top navigation bar.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <Upload className="h-3 w-3" />
                    <span>Upload Logo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    disabled={!profile.logoUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THEME & VISUAL APPEARANCE */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Theme &amp; Appearance
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Choose between crisp high-contrast Light mode and eye-safe Dark mode
              </p>
            </div>
          </div>

          {/* Quick Toggle Switch */}
          <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Moon className="h-3.5 w-3.5 text-indigo-400" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        {/* Theme Visual Cards Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Light Mode Card */}
          <div
            onClick={() => handleThemeChange('light')}
            className={`group relative cursor-pointer rounded-2xl border-2 p-4 sm:p-5 transition-all ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-600/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shadow-xs">
                  <Sun className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Light Mode
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    High contrast, daytime clarity
                  </p>
                </div>
              </div>
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-transparent'
                }`}
              >
                {theme === 'light' && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-inner space-y-2 overflow-hidden pointer-events-none select-none">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <div className="h-2 w-12 rounded bg-slate-300" />
                </div>
                <div className="h-2 w-6 rounded bg-emerald-200" />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="rounded-lg bg-white p-1.5 border border-slate-200 space-y-1">
                  <div className="h-1.5 w-8 rounded bg-slate-300" />
                  <div className="h-2.5 w-5 rounded bg-blue-500" />
                </div>
                <div className="rounded-lg bg-white p-1.5 border border-slate-200 space-y-1">
                  <div className="h-1.5 w-6 rounded bg-slate-300" />
                  <div className="h-2.5 w-7 rounded bg-emerald-500" />
                </div>
                <div className="rounded-lg bg-white p-1.5 border border-slate-200 space-y-1">
                  <div className="h-1.5 w-7 rounded bg-slate-300" />
                  <div className="h-2.5 w-4 rounded bg-purple-500" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5">
              Crisp daylight typography optimized for readability in brightly lit classrooms and libraries.
            </p>
          </div>

          {/* Dark Mode Card */}
          <div
            onClick={() => handleThemeChange('dark')}
            className={`group relative cursor-pointer rounded-2xl border-2 p-4 sm:p-5 transition-all ${
              theme === 'dark'
                ? 'border-indigo-500 bg-indigo-950/30 shadow-md ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/60 shadow-xs">
                  <Moon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Dark Mode (Default)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    OLED-friendly, reduced eye fatigue
                  </p>
                </div>
              </div>
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                  theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-600 text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-transparent'
                }`}
              >
                {theme === 'dark' && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-inner space-y-2 overflow-hidden pointer-events-none select-none">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  <div className="h-2 w-12 rounded bg-slate-700" />
                </div>
                <div className="h-2 w-6 rounded bg-emerald-900" />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="rounded-lg bg-slate-900 p-1.5 border border-slate-800 space-y-1">
                  <div className="h-1.5 w-8 rounded bg-slate-600" />
                  <div className="h-2.5 w-5 rounded bg-indigo-400" />
                </div>
                <div className="rounded-lg bg-slate-900 p-1.5 border border-slate-800 space-y-1">
                  <div className="h-1.5 w-6 rounded bg-slate-600" />
                  <div className="h-2.5 w-7 rounded bg-emerald-400" />
                </div>
                <div className="rounded-lg bg-slate-900 p-1.5 border border-slate-800 space-y-1">
                  <div className="h-1.5 w-7 rounded bg-slate-600" />
                  <div className="h-2.5 w-4 rounded bg-purple-400" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5">
              Deep slate tone with balanced luminescence, designed for late-night coding and exam preparation.
            </p>
          </div>
        </div>

        {/* Live UI Elements Preview */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              Live Theme Preview Components
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              State: {theme.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2.5 py-1">
              Batch {profile.batch}
            </span>
            <span className="rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-2.5 py-1">
              Coding: {profile.dailyCodingTargetMinutes}m/day
            </span>
            <span className="rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-semibold px-2.5 py-1">
              Study: {profile.dailyStudyTargetMinutes}m/day
            </span>
            <span className="rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-semibold px-2.5 py-1">
              Lab Room: 8108-BL8-FF
            </span>
          </div>
        </div>
      </section>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* 3. STUDENT IDENTIFICATION */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Student Profile &amp; Academic Identity
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Your university batch, department, and notification contact
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Kumar"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-emerald-500" />
                <span>WhatsApp Phone Number (Room Alerts)</span>
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="9334005518"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-blue-500" />
                <span>Batch Code</span>
              </label>
              <input
                type="text"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="25CAIBTCSB52"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-purple-500" />
                <span>Current Semester</span>
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="III"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* 4. ACADEMIC TARGETS & GOALS */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Study &amp; Coding Goals
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Set baseline targets for daily self-study and coding practice sessions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Daily Study Goal</span>
                <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                  {studyTarget} mins
                </span>
              </label>
              <input
                type="number"
                min="15"
                max="600"
                step="15"
                value={studyTarget}
                onChange={(e) => setStudyTarget(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Daily Coding Goal</span>
                <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                  {codingTarget} mins
                </span>
              </label>
              <input
                type="number"
                min="15"
                max="600"
                step="15"
                value={codingTarget}
                onChange={(e) => setCodingTarget(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Save Academic Preferences</span>
            </button>
          </div>
        </div>
      </form>

      {/* 5. DATA MANAGEMENT & RESETS */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <FileJson className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Storage &amp; Backup
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Export your study data or restore defaults anytime
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition active:scale-95 cursor-pointer"
          >
            <Download className="h-4 w-4 text-blue-500" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => resetTimetable()}
            className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/40 px-4 py-2.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-amber-600" />
            <span>Reset Timetable to Batch 25CAIBTCSB52</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all StudyOS data to initial default state?')) {
                resetAllData();
              }
            }}
            className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-50 dark:bg-red-950/40 px-4 py-2.5 text-xs font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-red-600" />
            <span>Factory Reset All Data</span>
          </button>
        </div>
      </section>
    </div>
  );
};
