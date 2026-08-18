import React, { useState } from 'react';
import {
  Code2,
  Flame,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock,
  Terminal,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CodingLog } from '../../types';

export const CodingTracker: React.FC = () => {
  const {
    codingLogs,
    addCodingLog,
    deleteCodingLog,
    profile,
    todayCodingMinutes,
  } = useApp();

  const [minutes, setMinutes] = useState(60);
  const [language, setLanguage] = useState<CodingLog['language']>('DSA');
  const [problemsSolved, setProblemsSolved] = useState(2);
  const [notes, setNotes] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  const categories: CodingLog['language'][] = [
    'DSA',
    'C++',
    'Python',
    'Java',
    'JavaScript',
    'SQL',
    'AI/ML',
    'Web Development',
  ];

  const totalProblemsAcross = codingLogs.reduce((a, c) => a + c.problemsSolved, 0);
  const totalMinutesAcross = codingLogs.reduce((a, c) => a + c.minutes, 0);

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    addCodingLog({
      date: new Date().toISOString().split('T')[0],
      minutes: Number(minutes),
      language,
      problemsSolved: Number(problemsSolved),
      notes: notes.trim() || undefined,
    });
    setNotes('');
    setShowLogModal(false);
  };

  // Group by language
  const languageStats = categories.map((cat) => {
    const logs = codingLogs.filter((c) => c.language === cat);
    const mins = logs.reduce((a, c) => a + c.minutes, 0);
    const count = logs.reduce((a, c) => a + c.problemsSolved, 0);
    return { name: cat, mins, count };
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Coding Practice &amp; DSA Tracker
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs px-2.5 py-0.5">
              <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              7 Day Streak
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build consistency across Data Structures &amp; Algorithms, LeetCode, and Full-Stack Engineering
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Log Coding Session</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">TODAY'S CODING</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {todayCodingMinutes}m
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              / {profile.dailyCodingTargetMinutes}m goal
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{
                width: `${Math.min(
                  (todayCodingMinutes / profile.dailyCodingTargetMinutes) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">PROBLEMS SOLVED</span>
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalProblemsAcross}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">+3 this week</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">DSA LeetCode &amp; Codeforces</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">TOTAL HOURS</span>
            <Terminal className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {Math.round((totalMinutesAcross / 60) * 10) / 10}h
            </span>
            <span className="text-xs text-slate-400">Logged</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Practical programming sessions</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">ACTIVE STREAK</span>
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              🔥 7 Days
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Target: 30-Day Semester Badge</p>
        </div>
      </div>

      {/* Languages & Topic Breakdown Grid */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Languages &amp; Domains
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {languageStats.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{item.mins}m</span>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                {item.count} Problems Solved
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Coding Sessions Ledger */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Recent Practice Logs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Domain / Language</th>
                <th className="pb-3 font-semibold">Duration</th>
                <th className="pb-3 font-semibold">Problems Solved</th>
                <th className="pb-3 font-semibold">Topic / Notes</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {codingLogs.map((log) => (
                <tr key={log.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 font-mono font-medium text-slate-600 dark:text-slate-400">
                    {log.date}
                  </td>
                  <td className="py-3">
                    <span className="rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold">
                      {log.language}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {log.minutes} mins
                  </td>
                  <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">
                    {log.problemsSolved}
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {log.notes || '—'}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => deleteCodingLog(log.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Coding Session Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowLogModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl z-10 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Log Coding Practice
            </h3>

            <form onSubmit={handleSaveLog} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Language / Domain
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="600"
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Problems Solved
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={problemsSolved}
                    onChange={(e) => setProblemsSolved(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Topics / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Graph BFS & Dijkstra algorithm"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
