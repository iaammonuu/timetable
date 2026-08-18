import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit2,
  MapPin,
  User,
  Share2,
  Flame,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DailyTask, TaskPriority, DayOfWeek } from '../../types';

export const TodayScheduleView: React.FC = () => {
  const {
    currentDay,
    currentTime,
    todayClasses,
    currentClass,
    nextClass,
    minutesUntilNextClass,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    openWhatsAppModalForDay,
    setFocusModeOpen,
    profile,
    markAttendance,
  } = useApp();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskTime, setTaskTime] = useState('18:00');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium');
  const [taskCategory, setTaskCategory] = useState<DailyTask['category']>('Study');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle.trim(),
      time: taskTime,
      priority: taskPriority,
      category: taskCategory,
      completed: false,
      date: new Date().toISOString().split('T')[0],
    });
    setTaskTitle('');
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a?.time && !b?.time) return 0;
    if (!a?.time) return 1;
    if (!b?.time) return -1;
    return (a.time || '').localeCompare(b.time || '');
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Today's Complete Schedule
            </h1>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-xs px-2.5 py-0.5">
              {currentDay}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            College Lectures &amp; Labs synchronized with your Personal Routine &amp; Study Sessions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openWhatsAppModalForDay(currentDay)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition"
          >
            <Share2 className="h-4 w-4" />
            <span>Send to WhatsApp</span>
          </button>
          <button
            onClick={() => setFocusModeOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/20 transition"
          >
            <Flame className="h-4 w-4 text-amber-300 fill-amber-300" />
            <span>Focus Session</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split: College Timetable on Left, Personal Daily Routine on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: College Timetable */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>College Timetable ({todayClasses.length} Sessions)</span>
              </h2>
              <span className="text-xs text-slate-400">Batch {profile.batch}</span>
            </div>
            {currentClass && (
              <span className="rounded-full bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 animate-pulse uppercase">
                Active Class
              </span>
            )}
          </div>

          {todayClasses.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No classes scheduled for today. Focus on independent study and projects!
            </div>
          ) : (
            <div className="space-y-3">
              {todayClasses.map((c, idx) => {
                const isLab = c.type === 'Lab';
                const isCurrent = currentClass?.id === c.id;

                return (
                  <div
                    key={c.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                          {c.startTime} - {c.endTime}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                            isLab
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          {c.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <MapPin className="h-3.5 w-3.5 text-red-500" />
                        <span>Room: {c.room || 'TBA'}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {c.subjectName}
                    </h4>

                    <div className="mt-2.5 flex items-center justify-between">
                      {c.faculty ? (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{c.faculty}</span>
                        </p>
                      ) : (
                        <div />
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => markAttendance(c.subjectId, true)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-100 transition"
                        >
                          + Attended
                        </button>
                        <button
                          onClick={() => markAttendance(c.subjectId, false)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-200 transition"
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Personal Schedule & Routine Planner */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span>Personal Routine &amp; Study Tasks</span>
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                {tasks.filter((t) => t.completed).length}/{tasks.length} Completed
              </span>
            </div>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="mb-4 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Task or routine item (e.g. 19:30 LeetCode Practice)"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="time"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="w-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!taskTitle.trim()}
                  className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">Priority:</span>
                {(['Low', 'Medium', 'High', 'Urgent'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTaskPriority(p)}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition ${
                      taskPriority === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </form>

            {/* Tasks List */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {sortedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between rounded-xl border p-3 transition ${
                    task.completed
                      ? 'border-slate-100 dark:border-slate-800/40 bg-slate-50/40 dark:bg-slate-900/30 opacity-60 text-slate-400 line-through'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="text-blue-600 shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                        {task.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400">
                        {task.time && <span className="font-mono">⏰ {task.time}</span>}
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

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
