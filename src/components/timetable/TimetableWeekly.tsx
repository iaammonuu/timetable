import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  RotateCcw,
  Share2,
  Filter,
  MapPin,
  User,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Layers,
  FlaskConical,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DayOfWeek, TimetableClass, ClassType } from '../../types';

export const TimetableWeekly: React.FC = () => {
  const {
    timetable,
    subjects,
    profile,
    openAddClassModal,
    openEditClassModal,
    resetTimetable,
    openWhatsAppModalForDay,
    openCalendarModal,
    currentDay,
  } = useApp();

  const [selectedDayFilter, setSelectedDayFilter] = useState<DayOfWeek | 'All'>('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<ClassType | 'All'>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Stats calculation
  const totalClassesCount = timetable.length;
  const lectureCount = timetable.filter((c) => c.type === 'Lecture').length;
  const labCount = timetable.filter((c) => c.type === 'Lab').length;

  // Filter classes
  const filteredClasses = timetable.filter((c) => {
    if (selectedDayFilter !== 'All' && c.day !== selectedDayFilter) return false;
    if (selectedTypeFilter !== 'All' && c.type !== selectedTypeFilter) return false;
    if (selectedSubjectFilter !== 'All' && c.subjectId !== selectedSubjectFilter) return false;
    return true;
  });

  return (
    <div className="space-y-5 pb-16">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Weekly Timetable
            </h1>
            <span className="rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-xs px-2.5 py-0.5 font-bold">
              {profile.batch}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Semester {profile.semester} Master Schedule • {lectureCount} Lectures • {labCount} Practical Labs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => resetTimetable()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Reset to default timetable schedule"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => openCalendarModal()}
            className="flex items-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-2 text-xs font-semibold transition cursor-pointer"
            title="Export timetable to Google Calendar (.ICS)"
          >
            <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Export Calendar</span>
          </button>

          <button
            onClick={() => openWhatsAppModalForDay(currentDay)}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-3 py-2 text-xs font-semibold transition cursor-pointer"
            title="Share today's schedule on WhatsApp"
          >
            <Share2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => openAddClassModal()}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {/* Filter & View Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* All Days Button */}
          <button
            onClick={() => setSelectedDayFilter('All')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              selectedDayFilter === 'All'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Week
          </button>

          {/* Individual Weekday Pills */}
          {days.map((d) => {
            const isSelected = selectedDayFilter === d;
            const isToday = currentDay === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDayFilter(d)}
                className={`relative rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{d.slice(0, 3)}</span>
                {isToday && !isSelected && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Dropdowns & Type Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Type Filter */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5">
            {(['All', 'Lecture', 'Lab'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTypeFilter(t)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                  selectedTypeFilter === t
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Subject Filter Dropdown */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5-Column Clean Weekly Schedule Grid */}
      {selectedDayFilter === 'All' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
          {days.map((day) => {
            const dayClasses = filteredClasses
              .filter((c) => c && c.day === day)
              .sort((a, b) => (a?.startTime || '').localeCompare(b?.startTime || ''));
            const isToday = currentDay === day;

            return (
              <div
                key={day}
                className={`rounded-2xl border flex flex-col transition-all overflow-hidden ${
                  isToday
                    ? 'border-blue-500/60 bg-white dark:bg-slate-900 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs'
                }`}
              >
                {/* Day Header */}
                <div
                  className={`p-3.5 border-b flex items-center justify-between ${
                    isToday
                      ? 'border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/40'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      {day}
                    </h3>
                    {isToday && (
                      <span className="rounded-md bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                        Today
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => openWhatsAppModalForDay(day)}
                    className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer"
                    title={`Export ${day} rooms to WhatsApp`}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Day Classes List */}
                <div className="p-3 space-y-2.5 min-h-[380px] flex-1 flex flex-col justify-start">
                  {dayClasses.length === 0 ? (
                    <div className="my-auto py-8 text-center text-slate-400 text-xs">
                      <Clock className="h-6 w-6 mx-auto text-slate-300 dark:text-slate-700 mb-1.5 stroke-[1.5]" />
                      <span>No classes scheduled</span>
                    </div>
                  ) : (
                    dayClasses.map((c) => {
                      const isLab = c.type === 'Lab';

                      return (
                        <div
                          key={c.id}
                          onClick={() => openEditClassModal(c)}
                          className={`group rounded-xl border p-3 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md ${
                            isLab
                              ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 hover:border-amber-400 dark:hover:border-amber-700'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-600'
                          }`}
                        >
                          {/* Time & Type Pill */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              {c.startTime} - {c.endTime}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                isLab
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                  : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              }`}
                            >
                              {c.type}
                            </span>
                          </div>

                          {/* Subject Name */}
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                            {c.subjectName}
                          </h4>

                          {/* Room & Faculty Details */}
                          <div className="mt-2.5 flex items-center justify-between text-[11px]">
                            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/60 shadow-2xs">
                              <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                              <span className="truncate max-w-[95px]">{c.room || 'TBA'}</span>
                            </span>
                            {c.faculty && (
                              <span className="text-slate-400 text-[10px] truncate max-w-[85px]">
                                {c.faculty.split(' ').slice(-1)[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Day Footer Add Button */}
                <div className="p-2.5 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => openAddClassModal(day)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Slot</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Focused Single Day View */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedDayFilter} Full Schedule
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {filteredClasses.length} sessions scheduled
              </p>
            </div>
            <button
              onClick={() => openWhatsAppModalForDay(selectedDayFilter as DayOfWeek)}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-500/20 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share to WhatsApp</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredClasses.map((c) => (
              <div
                key={c.id}
                onClick={() => openEditClassModal(c)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-blue-500 cursor-pointer transition bg-slate-50/40 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    {c.startTime} - {c.endTime}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {c.type}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {c.subjectName}
                </h4>
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <MapPin className="h-3.5 w-3.5 text-red-500" />
                    {c.room || 'TBA'}
                  </span>
                  {c.faculty && (
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-blue-500" />
                      {c.faculty}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
