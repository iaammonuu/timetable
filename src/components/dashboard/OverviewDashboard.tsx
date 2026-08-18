import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  Calendar,
  Flame,
  BookOpen,
  ArrowRight,
  Plus,
  Share2,
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Code2,
  Check,
  Circle,
  ExternalLink,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskPriority } from '../../types';

export const OverviewDashboard: React.FC = () => {
  const {
    profile,
    currentTime,
    currentDay,
    todayClasses,
    currentClass,
    nextClass,
    minutesUntilNextClass,
    overallAttendancePercentage,
    todayStudyMinutes,
    todayCodingMinutes,
    tasks,
    toggleTask,
    addTask,
    assignments,
    exams,
    setActiveTab,
    setFocusModeOpen,
    openWhatsAppModalForDay,
    openCalendarModal,
    markAttendance,
    subjects,
  } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');

  // Dynamic greeting based on current time
  const hour = currentTime.getHours();
  let greeting = 'Good Morning';
  if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
  else if (hour >= 17 && hour < 22) greeting = 'Good Evening';
  else if (hour >= 22 || hour < 5) greeting = 'Good Night';

  // Calculate free time periods today
  const freePeriodCount = Math.max(0, 7 - todayClasses.length);

  // Motivational quote
  const quotes = [
    '"Consistent effort beats natural talent when talent skips practice."',
    '"Code. Study. Repeat. Semester III is yours to dominate."',
    '"Every lab completed is one step closer to engineering mastery."',
    '"Stay ahead of the syllabus, stay calm in the finals."',
  ];
  const dailyQuote = quotes[Math.floor(currentTime.getDate()) % quotes.length];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
      category: 'Study',
      date: new Date().toISOString().split('T')[0],
    });
    setNewTaskTitle('');
  };

  const pendingAssignments = assignments
    .filter((a) => a.status !== 'Completed')
    .slice(0, 3);

  const upcomingExams = exams.slice(0, 2);

  // Helper for class status relative to current time
  const getClassStatus = (startTime: string, endTime: string) => {
    const [currH, currM] = [currentTime.getHours(), currentTime.getMinutes()];
    const currMin = currH * 60 + currM;
    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    const startMin = sH * 60 + sM;
    const endMin = eH * 60 + eM;

    if (currMin >= endMin) return 'completed';
    if (currMin >= startMin && currMin < endMin) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* 1. Hero Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-blue-500/10">
        {/* Ambient subtle glow background */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-blue-100 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Batch {profile.batch} • Sem {profile.semester}
              </span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 text-xs font-semibold">
                {currentDay} Schedule
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {greeting}, {profile.name} 👋
            </h1>
            <p className="mt-1.5 text-xs md:text-sm text-blue-100/80 max-w-xl italic">
              {dailyQuote}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openCalendarModal()}
              className="flex items-center gap-2 rounded-xl bg-blue-500/80 hover:bg-blue-500 border border-white/20 px-3.5 py-2.5 text-xs font-bold text-white backdrop-blur-md transition active:scale-95 shadow-md shadow-blue-500/20"
              title="Sync semester schedule to Google Calendar"
            >
              <Calendar className="h-4 w-4" />
              <span>Google Calendar Sync</span>
            </button>

            <button
              onClick={() => openWhatsAppModalForDay(currentDay)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition active:scale-95"
            >
              <Share2 className="h-4 w-4" />
              <span>Send Day Rooms to WhatsApp</span>
            </button>

            <button
              onClick={() => setFocusModeOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/20 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition active:scale-95"
            >
              <Flame className="h-4 w-4 text-amber-300 fill-amber-300" />
              <span>Start Focus Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next/Current Class Card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {currentClass ? 'CURRENT CLASS 🔴' : 'NEXT CLASS ⏰'}
            </span>
            <span className="rounded bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5">
              {currentClass ? 'In Session' : nextClass ? `${nextClass.startTime}` : 'Done for Today'}
            </span>
          </div>

          {currentClass ? (
            <div className="mt-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {currentClass.subjectName}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                  <MapPin className="h-3 w-3" />
                  {currentClass.room || 'TBA'}
                </span>
                <span className="text-[11px]">{currentClass.type}</span>
              </div>
              <p className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Ends at {currentClass.endTime}
              </p>
            </div>
          ) : nextClass ? (
            <div className="mt-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {nextClass.subjectName}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                  <MapPin className="h-3 w-3" />
                  {nextClass.room || 'TBA'}
                </span>
                <span className="text-[11px]">{nextClass.type}</span>
              </div>
              <p className="mt-2 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                {minutesUntilNextClass !== null && minutesUntilNextClass > 0
                  ? `Starts in ${minutesUntilNextClass} minutes`
                  : `Starts at ${nextClass.startTime}`}
              </p>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                All Classes Done! 🎉
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Great job today. Time for self-study and coding!
              </p>
            </div>
          )}
        </div>

        {/* Study Target Progress */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              DAILY STUDY GOAL
            </span>
            <BrainCircuit className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {todayStudyMinutes}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              / {profile.dailyStudyTargetMinutes} mins
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-purple-600 transition-all duration-500"
              style={{
                width: `${Math.min(
                  (todayStudyMinutes / profile.dailyStudyTargetMinutes) * 100,
                  100
                )}%`,
              }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>
              {Math.round((todayStudyMinutes / profile.dailyStudyTargetMinutes) * 100)}% achieved
            </span>
            <button
              onClick={() => setActiveTab('study')}
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Study Now →
            </button>
          </p>
        </div>

        {/* Assignments & Tasks Status */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              ASSIGNMENTS
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                pendingAssignments.length === 0
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
              }`}
            >
              {pendingAssignments.length === 0 ? 'ALL DONE' : `${pendingAssignments.length} PENDING`}
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {assignments.length - pendingAssignments.length}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              / {assignments.length} Completed
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${
                  assignments.length > 0
                    ? Math.round(
                        ((assignments.length - pendingAssignments.length) /
                          assignments.length) *
                          100
                      )
                    : 100
                }%`,
              }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{pendingAssignments.length} due soon</span>
            <button
              onClick={() => setActiveTab('assignments')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              View Tasks →
            </button>
          </p>
        </div>

        {/* Coding Streak & Problems */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              CODING STREAK
            </span>
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              🔥 7 Days
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Streak
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
            <Code2 className="h-3.5 w-3.5 text-blue-500" />
            <span>Today: {todayCodingMinutes}m / {profile.dailyCodingTargetMinutes}m target</span>
          </p>
          <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <span className="text-slate-400">DSA &amp; C++</span>
            <button
              onClick={() => setActiveTab('coding')}
              className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
            >
              Log Problem →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Split Grid: Today's Timeline vs Tasks & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Visual Class Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Today's Class Schedule ({currentDay})</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {todayClasses.length} sessions scheduled for Batch {profile.batch}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openWhatsAppModalForDay(currentDay)}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-100 transition"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  WhatsApp Rooms
                </button>
                <button
                  onClick={() => setActiveTab('timetable')}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Full Week <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {todayClasses.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                  No Classes Today! 🎉
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Enjoy your day off or utilize this free time to work on LeetCode DSA, AWS cloud projects, and semester revision.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {todayClasses.map((item, idx) => {
                  const status = getClassStatus(item.startTime, item.endTime);
                  const isCurrent = status === 'current';
                  const isCompleted = status === 'completed';

                  return (
                    <div
                      key={item.id}
                      className={`relative group rounded-xl border p-4 transition-all ${
                        isCurrent
                          ? 'border-blue-500/80 bg-blue-50/70 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/20'
                          : isCompleted
                          ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 opacity-75'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[31px] md:-left-[39px] top-5 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900 transition-transform group-hover:scale-125 ${
                          isCurrent
                            ? 'border-blue-600 ring-4 ring-blue-500/20'
                            : isCompleted
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-3 w-3 text-white stroke-[3]" />
                        ) : isCurrent ? (
                          <div className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {item.startTime} - {item.endTime}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              item.type === 'Lab'
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            }`}
                          >
                            {item.type}
                          </span>
                          {isCurrent && (
                            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-bold text-white uppercase animate-pulse">
                              Ongoing
                            </span>
                          )}
                        </div>

                        {/* Room Badge */}
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                          <MapPin className="h-3.5 w-3.5 text-red-500" />
                          <span>Room: {item.room || 'TBA'}</span>
                        </div>
                      </div>

                      <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.subjectName}
                          </h4>
                          {item.faculty && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <User className="h-3 w-3" />
                              <span>{item.faculty}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Daily Priorities, Deadlines & Exams */}
        <div className="space-y-6">
          {/* Daily Task & Routine Checklist */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Daily Planner &amp; Tasks</span>
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {tasks.filter((t) => t.completed).length}/{tasks.length} Done
              </span>
            </div>

            {/* Quick Add Task Input */}
            <form onSubmit={handleCreateTask} className="mb-3 flex gap-1.5">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="+ Add task or revision target..."
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`group flex items-start gap-2.5 rounded-lg border p-2.5 cursor-pointer transition ${
                    task.completed
                      ? 'border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/40 opacity-60 line-through text-slate-400'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-slate-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 text-blue-600">
                    {task.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                      {task.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                      {task.time && <span>⏰ {task.time}</span>}
                      <span
                        className={`font-semibold ${
                          task.priority === 'Urgent'
                            ? 'text-red-500'
                            : task.priority === 'High'
                            ? 'text-amber-500'
                            : 'text-slate-400'
                        }`}
                      >
                        • {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Assignments Radar */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span>Pending Assignments</span>
              </h3>
              <button
                onClick={() => setActiveTab('assignments')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                All ({assignments.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingAssignments.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  All assignments submitted! 🎉
                </p>
              ) : (
                pendingAssignments.map((a) => {
                  const sub = subjects.find((s) => s.id === a.subjectId);
                  return (
                    <div
                      key={a.id}
                      onClick={() => setActiveTab('assignments')}
                      className="group rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:border-blue-400 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 truncate max-w-[140px]">
                          {sub?.name || 'Academic'}
                        </span>
                        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                          Due: {a.dueDate}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 line-clamp-1 group-hover:text-blue-600">
                        {a.title}
                      </h4>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Progress: {a.completionPercentage}%</span>
                        <span className="font-semibold text-slate-500">{a.priority} Priority</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Exam Countdown */}
          <div className="rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span>Exam Countdown</span>
              </h3>
              <button
                onClick={() => setActiveTab('exams')}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Plan →
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingExams.map((ex) => {
                const sub = subjects.find((s) => s.id === ex.subjectId);
                const daysRemaining = Math.max(
                  0,
                  Math.ceil(
                    (new Date(ex.date).getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24)
                  )
                );
                return (
                  <div
                    key={ex.id}
                    className="rounded-xl border border-purple-200/60 dark:border-purple-800/50 bg-white dark:bg-slate-900 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {sub?.name || ex.examName}
                      </span>
                      <span className="rounded-full bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300">
                        {daysRemaining} Days Left
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {ex.examName} • Room {ex.room}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${ex.preparationPercentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-purple-600 dark:text-purple-400">
                        {ex.preparationPercentage}% Prep
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
