import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../utils/sound';

export const SmartStudyPlanner: React.FC = () => {
  const {
    subjects,
    studySessions,
    addStudySession,
    setFocusModeOpen,
    profile,
    todayStudyMinutes,
  } = useApp();

  // Generator form
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [topicName, setTopicName] = useState('Process Scheduling & Concurrency');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [durationMinutes, setDurationMinutes] = useState(60);

  // Generated Plan
  const [generatedPlan, setGeneratedPlan] = useState<{
    phase1: { title: string; min: number; desc: string };
    phase2: { title: string; min: number; desc: string };
    phase3: { title: string; min: number; desc: string };
    phase4: { title: string; min: number; desc: string };
  } | null>(null);

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<'25/5' | '50/10' | '90/15' | 'custom'>('50/10');
  const [timerDurationSec, setTimerDurationSec] = useState(50 * 60);
  const [timeLeftSec, setTimeLeftSec] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Auto generate initial plan
  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = () => {
    const total = durationMinutes;
    let p1 = Math.round(total * 0.35);
    let p2 = Math.round(total * 0.35);
    let p3 = Math.round(total * 0.2);
    let p4 = total - (p1 + p2 + p3);
    if (p4 <= 0) p4 = 5;

    setGeneratedPlan({
      phase1: {
        title: 'Concept & Theory Deep Dive',
        min: p1,
        desc: 'Read lecture notes, textbook chapters, and identify fundamental axioms and theorems.',
      },
      phase2: {
        title: 'Active Practice & Numerical Problems',
        min: p2,
        desc: 'Solve textbook exercises, past mid-sem questions, and trace algorithmic steps on paper.',
      },
      phase3: {
        title: 'Summarize & Flashcard Revision',
        min: p3,
        desc: 'Synthesize formulas, mind-maps, and key edge-case definitions.',
      },
      phase4: {
        title: 'Quick Recall Self-Test',
        min: p4,
        desc: 'Close notes and write out the top 3 core principles from memory.',
      },
    });
  };

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeftSec > 0) {
      interval = setInterval(() => {
        setTimeLeftSec((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSec === 0 && isRunning) {
      setIsRunning(false);
      sounds.playPomodoroFinish();
      if (!isBreak) {
        // Log study session
        const mins = Math.round(timerDurationSec / 60);
        addStudySession({
          date: new Date().toISOString().split('T')[0],
          subjectId: selectedSubjectId,
          topic: topicName,
          durationMinutes: mins,
          mode: 'Pomodoro',
        });
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeftSec, isBreak, timerDurationSec, selectedSubjectId, topicName]);

  const selectTimerMode = (mode: '25/5' | '50/10' | '90/15' | 'custom') => {
    setTimerMode(mode);
    setIsRunning(false);
    setIsBreak(false);
    let mins = 50;
    if (mode === '25/5') mins = 25;
    else if (mode === '90/15') mins = 90;
    setTimerDurationSec(mins * 60);
    setTimeLeftSec(mins * 60);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeftSec(timerDurationSec);
  };

  const handleFinishEarly = () => {
    setIsRunning(false);
    const elapsedMinutes = Math.max(1, Math.round((timerDurationSec - timeLeftSec) / 60));
    addStudySession({
      date: new Date().toISOString().split('T')[0],
      subjectId: selectedSubjectId,
      topic: topicName,
      durationMinutes: elapsedMinutes,
      mode: 'Pomodoro',
    });
    setTimeLeftSec(timerDurationSec);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((timerDurationSec - timeLeftSec) / timerDurationSec) * 100);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Smart Study Planner &amp; Focus Engine
            </h1>
            <span className="rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold text-xs px-2.5 py-0.5">
              AI Powered
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate custom session structures, study in Pomodoro focus blocks, and automatically track subject hours.
          </p>
        </div>

        <button
          onClick={() => setFocusModeOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:opacity-95 transition active:scale-95"
        >
          <Flame className="h-4 w-4 fill-amber-300 text-amber-300" />
          <span>Launch Fullscreen Focus Mode</span>
        </button>
      </div>

      {/* 2-Column Split: Plan Generator vs Interactive Pomodoro Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Study Plan Generator (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Session Generator
            </h2>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Select Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Study Topic or Chapter
            </label>
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="e.g. Relational Normalization & BCNF"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Difficulty
              </label>
              <div className="flex gap-1">
                {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-1.5 rounded-lg border text-[11px] font-semibold transition ${
                      difficulty === d
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Available Time
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-900 dark:text-white"
              >
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes (1 hr)</option>
                <option value={90}>90 Minutes (1.5 hr)</option>
                <option value={120}>120 Minutes (2 hrs)</option>
              </select>
            </div>
          </div>

          <button
            onClick={generatePlan}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white shadow-md shadow-purple-500/20 transition active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            Generate Structured Plan
          </button>

          {/* Generated Plan Breakdown */}
          {generatedPlan && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Generated 4-Phase Roadmap:
              </span>

              {[
                { ...generatedPlan.phase1, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
                { ...generatedPlan.phase2, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
                { ...generatedPlan.phase3, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
                { ...generatedPlan.phase4, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 flex items-start gap-2.5"
                >
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono shrink-0 ${p.color}`}>
                    {p.min} min
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Phase {idx + 1}: {p.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Pomodoro Timer & Live Tracker (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-xs">
          <div>
            {/* Mode Presets */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pomodoro Focus Timer
                </h3>
                <p className="text-xs text-slate-400">
                  Subject: {subjects.find((s) => s.id === selectedSubjectId)?.name || 'Study'}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {(['25/5', '50/10', '90/15'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => selectTimerMode(m)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      timerMode === m
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Giant Circular / Radial Digital Display */}
            <div className="my-8 flex flex-col items-center justify-center">
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-8 border-slate-100 dark:border-slate-800 shadow-inner">
                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 h-full w-full -rotate-90">
                  <circle
                    cx="112"
                    cy="112"
                    r="100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={628}
                    strokeDashoffset={628 - (628 * progressPercent) / 100}
                    className="text-purple-600 transition-all duration-1000 ease-linear"
                  />
                </svg>

                <div className="text-center z-10">
                  <span className="font-mono text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                    {formatTimer(timeLeftSec)}
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    {isRunning ? '🔥 Focus In Progress' : 'Paused / Ready'}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs font-medium text-slate-600 dark:text-slate-300 max-w-sm text-center">
                Current: <strong className="text-purple-600 dark:text-purple-400">{topicName}</strong>
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleResetTimer}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => {
                  sounds.playBeep(440, 'sine', 0.1);
                  setIsRunning(!isRunning);
                }}
                className={`flex items-center gap-2 rounded-xl px-7 py-2.5 text-sm font-bold text-white shadow-lg transition active:scale-95 ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/25'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" /> Start Session
                  </>
                )}
              </button>

              <button
                onClick={handleFinishEarly}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Log &amp; Finish</span>
              </button>
            </div>
          </div>

          {/* Today's Study Log Summary */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Today's Logged Study: <strong>{todayStudyMinutes} mins</strong> ({profile.dailyStudyTargetMinutes} min goal)
            </span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {studySessions.length} total logged sessions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
