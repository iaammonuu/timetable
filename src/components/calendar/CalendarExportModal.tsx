import React, { useState } from 'react';
import {
  X,
  Calendar,
  Download,
  ExternalLink,
  CheckCircle2,
  Bell,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  Clock,
  BookOpen,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  generateTimetableICS,
  downloadICSFile,
  getSingleClassGoogleCalendarUrl,
} from '../../utils/calendarExport';
import { TimetableClass } from '../../types';

export const CalendarExportModal: React.FC = () => {
  const {
    calendarModalOpen,
    closeCalendarModal,
    timetable,
    subjects,
    profile,
    showToast,
  } = useApp();

  const [reminderMinutes, setReminderMinutes] = useState<number>(10);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Lecture', 'Lab']);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(
    subjects.map((s) => s.id)
  );
  const [semesterWeeks, setSemesterWeeks] = useState<number>(16);
  const [activeTab, setActiveTab] = useState<'ics' | 'individual' | 'instructions'>('ics');

  if (!calendarModalOpen) return null;

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectAllSubjects = () => {
    setSelectedSubjectIds(subjects.map((s) => s.id));
  };

  const deselectAllSubjects = () => {
    setSelectedSubjectIds([]);
  };

  const filteredCount = timetable.filter(
    (c) =>
      selectedTypes.includes(c.type) &&
      (selectedSubjectIds.length === 0 || selectedSubjectIds.includes(c.subjectId))
  ).length;

  const handleDownloadICS = () => {
    const startDate = new Date();
    const endDate = new Date(Date.now() + semesterWeeks * 7 * 24 * 60 * 60 * 1000);

    const icsContent = generateTimetableICS(timetable, subjects, {
      batch: profile.batch,
      semester: profile.semester,
      studentName: profile.name,
      startDate,
      endDate,
      selectedSubjectIds,
      selectedTypes,
      reminderMinutes,
    });

    const filename = `StudyOS_Timetable_${profile.batch}_Sem${profile.semester}.ics`;
    downloadICSFile(filename, icsContent);
    showToast(`Downloaded ${filename} for Google Calendar!`, 'success');
  };

  const handleOpenGoogleCalendarImport = () => {
    window.open('https://calendar.google.com/calendar/u/0/r/settings/export', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={closeCalendarModal} />

      {/* Dialog Container */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-7 shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Export to Google Calendar &amp; iCal
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sync your complete weekly schedule, room numbers, and reminders directly into your calendar
              </p>
            </div>
          </div>
          <button
            onClick={closeCalendarModal}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ics')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'ics'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Full Semester Sync (.ICS)
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'individual'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            1-Click Class Links
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'instructions'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            How to Import
          </button>
        </div>

        {/* Tab 1: Full Semester ICS Configuration */}
        {activeTab === 'ics' && (
          <div className="mt-5 space-y-5">
            {/* Quick Status Pill */}
            <div className="flex items-center justify-between rounded-2xl bg-blue-50 dark:bg-blue-950/40 p-4 border border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs">
                  {filteredCount}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">
                    {filteredCount} Recurring Classes per Week Selected
                  </h4>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300">
                    Includes all room numbers ({profile.batch} • Sem {profile.semester}) for {semesterWeeks} weeks
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 text-[10px] font-bold">
                RFC 5545 Standard
              </span>
            </div>

            {/* Sync Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Reminder Alert */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-500" />
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Pre-Class Alarm Notification
                  </label>
                </div>
                <p className="text-[11px] text-slate-400">
                  Google Calendar notification before each lecture/lab
                </p>
                <select
                  value={reminderMinutes}
                  onChange={(e) => setReminderMinutes(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white focus:outline-hidden"
                >
                  <option value={0}>No Alarm</option>
                  <option value={5}>5 minutes before</option>
                  <option value={10}>10 minutes before (Recommended)</option>
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                </select>
              </div>

              {/* Semester Duration */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Semester Duration (Repeat Until)
                  </label>
                </div>
                <p className="text-[11px] text-slate-400">
                  Repeat weekly until the semester concludes
                </p>
                <select
                  value={semesterWeeks}
                  onChange={(e) => setSemesterWeeks(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white focus:outline-hidden"
                >
                  <option value={8}>8 Weeks (~2 Months)</option>
                  <option value={12}>12 Weeks (~3 Months)</option>
                  <option value={16}>16 Weeks (~4 Months / Full Sem)</option>
                  <option value={20}>20 Weeks (~5 Months)</option>
                </select>
              </div>
            </div>

            {/* Session Type Filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Session Types to Include
              </label>
              <div className="flex flex-wrap gap-2">
                {['Lecture', 'Lab', 'Tutorial', 'Seminar'].map((type) => {
                  const active = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                        active
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${type === 'Lab' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                      <span>{type}s</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subjects Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Subjects ({selectedSubjectIds.length}/{subjects.length})
                </label>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    onClick={selectAllSubjects}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={deselectAllSubjects}
                    className="text-slate-400 hover:underline"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {subjects.map((sub) => {
                  const isChecked = selectedSubjectIds.includes(sub.id);
                  return (
                    <div
                      key={sub.id}
                      onClick={() => toggleSubject(sub.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                        isChecked
                          ? 'border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/20 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: sub.color }}
                        />
                        <span className="text-xs font-semibold truncate">{sub.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 ml-2">
                        {sub.code}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Download & Direct Sync Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadICS}
                disabled={filteredCount === 0}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:opacity-95 disabled:opacity-50 transition active:scale-98"
              >
                <Download className="h-4 w-4" />
                <span>Download .ICS Calendar File</span>
              </button>

              <button
                onClick={handleOpenGoogleCalendarImport}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition"
              >
                <ExternalLink className="h-4 w-4 text-blue-500" />
                <span>Open Google Calendar Import</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Individual 1-Click Web Links */}
        {activeTab === 'individual' && (
          <div className="mt-5 space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any class below to instantly add a recurring weekly event to your Google Calendar in one click:
            </p>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto custom-scrollbar">
              {timetable.map((c) => {
                const sub = subjects.find((s) => s.id === c.subjectId);
                const gCalUrl = getSingleClassGoogleCalendarUrl(c, sub, profile.batch);

                return (
                  <div
                    key={c.id}
                    className="py-2.5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-slate-600 dark:text-slate-400">
                          {c.day.slice(0, 3)}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {c.subjectName}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                          c.type === 'Lab' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {c.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {c.startTime} - {c.endTime} • Room: <strong>{c.room || 'TBA'}</strong>
                      </p>
                    </div>

                    <a
                      href={gCalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition shrink-0"
                    >
                      <span>Add to Google Cal</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Step-by-Step Google Calendar Instructions */}
        {activeTab === 'instructions' && (
          <div className="mt-5 space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                How to Import Your Timetable into Google Calendar
              </h4>

              <ol className="space-y-2.5 list-decimal list-inside text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <li>
                  Click the <strong>"Download .ICS Calendar File"</strong> button in the first tab.
                </li>
                <li>
                  Open{' '}
                  <a
                    href="https://calendar.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline font-semibold"
                  >
                    Google Calendar
                  </a>{' '}
                  on your computer or mobile browser.
                </li>
                <li>
                  Click the <strong>Settings Gear icon (⚙️)</strong> at the top right, then select <strong>Settings</strong>.
                </li>
                <li>
                  In the left sidebar menu, click <strong>Import &amp; Export</strong>.
                </li>
                <li>
                  Under <em>"Import"</em>, click <strong>"Select file from your computer"</strong> and choose your downloaded <code className="rounded bg-slate-200 dark:bg-slate-700 px-1 py-0.5 font-mono">.ics</code> file.
                </li>
                <li>
                  Select which calendar to add the classes to, then click <strong>Import</strong>!
                </li>
              </ol>
            </div>

            <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
              <Info className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
              <p className="text-[11px] leading-normal">
                <strong>Pro Tip:</strong> We recommend creating a dedicated calendar called <em>"College Classes"</em> in Google Calendar before importing. That way, you can easily toggle its visibility or color code it separately from your personal events!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
