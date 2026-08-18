import React from 'react';
import {
  TrendingUp,
  BrainCircuit,
  Code2,
  CheckCircle2,
  Calendar,
  Sparkles,
  Trophy,
  Flame,
  Clock,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const ProductivityAnalytics: React.FC = () => {
  const {
    subjects,
    studySessions,
    codingLogs,
    tasks,
    profile,
    todayStudyMinutes,
    todayCodingMinutes,
  } = useApp();

  // Weekly study data
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyStudyData = [
    { day: 'Mon', study: 3.5, coding: 1.5, target: 4.0 },
    { day: 'Tue', study: 4.0, coding: 2.0, target: 4.0 },
    { day: 'Wed', study: 2.5, coding: 1.0, target: 4.0 },
    { day: 'Thu', study: 4.5, coding: 2.5, target: 4.0 },
    { day: 'Fri', study: 3.0, coding: 1.5, target: 4.0 },
    { day: 'Sat', study: 5.5, coding: 3.0, target: 4.0 },
    { day: 'Sun', study: 4.0, coding: 2.0, target: 4.0 },
  ];

  // Subject attendance data
  const subjectAttendanceData = subjects.map((s) => {
    const pct = s.totalClasses > 0 ? Math.round((s.attendedClasses / s.totalClasses) * 100) : 100;
    return {
      name: s.code,
      fullName: s.name,
      attendance: pct,
      target: profile.minAttendancePercentage || 75,
    };
  });

  // Calculate Productivity Score (0-100)
  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskRatio = tasks.length > 0 ? completedTasks / tasks.length : 1;
  const studyRatio = Math.min(1, todayStudyMinutes / profile.dailyStudyTargetMinutes);
  const codingRatio = Math.min(1, todayCodingMinutes / profile.dailyCodingTargetMinutes);
  const productivityScore = Math.round((taskRatio * 0.4 + studyRatio * 0.35 + codingRatio * 0.25) * 100);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            Productivity &amp; Academic Intelligence
          </h1>
          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-xs px-2.5 py-0.5">
            Weekly Insights
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Deep analytics on self-study hours, algorithmic coding consistency, and attendance trajectories
        </p>
      </div>

      {/* Top 4 Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">PRODUCTIVITY SCORE</span>
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {productivityScore}
            </span>
            <span className="text-xs font-semibold text-emerald-600">/ 100 (Top Tier)</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Calculated from tasks, study, and code</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">WEEKLY STUDY HOURS</span>
            <BrainCircuit className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400">
              27.0h
            </span>
            <span className="text-xs text-slate-400">/ 28h Target</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Across 6 academic subjects</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">CODING CONSISTENCY</span>
            <Code2 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
              13.5h
            </span>
            <span className="text-xs text-emerald-600 font-semibold">+18% vs last week</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">DSA &amp; Web development</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">ACTIVE STREAK</span>
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
              🔥 7 Days
            </span>
            <span className="text-xs text-amber-500 font-semibold">Unbroken</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Daily goal achievement streak</p>
        </div>
      </div>

      {/* Chart 1: Weekly Study & Coding Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Study &amp; Coding Breakdown (Hours)
              </h3>
              <p className="text-xs text-slate-400">Mon - Sun comparative distribution</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-600" />
                <span className="text-slate-600 dark:text-slate-300">Study</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-600 dark:text-slate-300">Coding</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStudyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="study" fill="#9333ea" radius={[4, 4, 0, 0]} name="Academic Study (h)" />
                <Bar dataKey="coding" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Coding Practice (h)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Subject Attendance % vs 75% Rule */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Attendance by Subject (%)
              </h3>
              <p className="text-xs text-slate-400">Red line marks 75% statutory requirement</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectAttendanceData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fontWeight: 'bold' }} width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <ReferenceLine x={75} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '75%', fill: '#ef4444', fontSize: 10 }} />
                <Bar dataKey="attendance" fill="#10b981" radius={[0, 4, 4, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
