import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  Sparkles,
  Maximize2,
  Minimize2,
  Waves,
  CloudRain,
  Radio,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { sounds, AmbientSoundType } from '../../utils/sound';

export const FocusModeModal: React.FC = () => {
  const {
    focusModeOpen,
    setFocusModeOpen,
    subjects,
    tasks,
    addStudySession,
  } = useApp();

  const [timerDurationSec, setTimerDurationSec] = useState(25 * 60);
  const [timeLeftSec, setTimeLeftSec] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [sessionTopic, setSessionTopic] = useState('Deep Work & Problem Solving');

  // Ambient sound
  const [ambientType, setAmbientType] = useState<AmbientSoundType>('none');
  const [ambientVolume, setAmbientVolume] = useState(0.2);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeftSec > 0) {
      interval = setInterval(() => {
        setTimeLeftSec((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSec === 0 && isRunning) {
      setIsRunning(false);
      sounds.stopAmbient();
      sounds.playPomodoroFinish();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      const mins = Math.round(timerDurationSec / 60);
      addStudySession({
        date: new Date().toISOString().split('T')[0],
        subjectId: selectedSubjectId,
        topic: sessionTopic,
        durationMinutes: mins,
        mode: 'Deep Focus',
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeftSec, timerDurationSec, selectedSubjectId, sessionTopic]);

  // Clean up ambient sound on close
  useEffect(() => {
    if (!focusModeOpen) {
      sounds.stopAmbient();
      setIsRunning(false);
    }
  }, [focusModeOpen]);

  if (!focusModeOpen) return null;

  const handleTogglePlay = () => {
    const next = !isRunning;
    setIsRunning(next);
    if (next) {
      if (ambientType !== 'none') {
        sounds.playAmbient(ambientType, ambientVolume);
      }
    } else {
      sounds.stopAmbient();
    }
  };

  const handleSoundChange = (type: AmbientSoundType) => {
    setAmbientType(type);
    if (isRunning) {
      if (type === 'none') {
        sounds.stopAmbient();
      } else {
        sounds.playAmbient(type, ambientVolume);
      }
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    sounds.setAmbientVolume(vol);
  };

  const handleFinishEarly = () => {
    setIsRunning(false);
    sounds.stopAmbient();
    const elapsedMinutes = Math.max(1, Math.round((timerDurationSec - timeLeftSec) / 60));
    addStudySession({
      date: new Date().toISOString().split('T')[0],
      subjectId: selectedSubjectId,
      topic: sessionTopic,
      durationMinutes: elapsedMinutes,
      mode: 'Deep Focus',
    });
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
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
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white animate-in fade-in">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/30">
            <Flame className="h-5 w-5 fill-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Deep Work Focus Room
            </h2>
            <span className="text-xs text-slate-400">Zero Distractions • Synthesized Audio</span>
          </div>
        </div>

        {/* Ambient Sound Selector */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-1.5">
          <button
            onClick={() => handleSoundChange('none')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              ambientType === 'none' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Silent
          </button>
          <button
            onClick={() => handleSoundChange('rain')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              ambientType === 'rain' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="h-3.5 w-3.5" /> Rain
          </button>
          <button
            onClick={() => handleSoundChange('whitenoise')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              ambientType === 'whitenoise' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="h-3.5 w-3.5" /> White Noise
          </button>
          <button
            onClick={() => handleSoundChange('binaural')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              ambientType === 'binaural' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Waves className="h-3.5 w-3.5" /> Binaural
          </button>

          {ambientType !== 'none' && (
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.02"
              value={ambientVolume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-16 accent-purple-500"
              title="Sound Volume"
            />
          )}
        </div>

        {/* Exit Button */}
        <button
          onClick={() => setFocusModeOpen(false)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main Focus Center */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto w-full">
        {/* Preset Selector */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { label: '25m Pomodoro', min: 25 },
            { label: '50m Deep Work', min: 50 },
            { label: '90m Ultradian', min: 90 },
          ].map((preset) => (
            <button
              key={preset.min}
              onClick={() => {
                setIsRunning(false);
                setTimerDurationSec(preset.min * 60);
                setTimeLeftSec(preset.min * 60);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                timerDurationSec === preset.min * 60
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Radial Timer */}
        <div className="relative flex h-72 w-72 items-center justify-center rounded-full border-8 border-slate-900 shadow-2xl my-4">
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="144"
              cy="144"
              r="128"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="10"
              strokeDasharray={804}
              strokeDashoffset={804 - (804 * progressPercent) / 100}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="z-10 text-center">
            <span className="font-mono text-6xl font-black tracking-tight text-white">
              {formatTimer(timeLeftSec)}
            </span>
            <span className="mt-2 block text-xs font-bold text-purple-400 uppercase tracking-widest">
              {isRunning ? '🔥 Focus Mode On' : 'Paused / Ready'}
            </span>
          </div>
        </div>

        {/* Subject & Topic Selector */}
        <div className="w-full mt-6 space-y-3">
          <div className="flex gap-2">
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-white focus:outline-hidden"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              placeholder="What are you focusing on?"
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeftSec(timerDurationSec);
            }}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Reset Timer"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 rounded-2xl px-8 py-3.5 text-base font-bold text-white shadow-xl transition active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5" /> Pause Session
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-white" /> Start Deep Work
              </>
            )}
          </button>

          <button
            onClick={handleFinishEarly}
            className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60 transition"
            title="Complete & Log"
          >
            <CheckCircle2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
