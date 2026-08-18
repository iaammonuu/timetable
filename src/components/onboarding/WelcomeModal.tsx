import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WelcomeModal: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Check if first visit
  React.useEffect(() => {
    const seen = localStorage.getItem('studyos_onboarding_seen');
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  const [name, setName] = useState(profile.name);
  const [batch, setBatch] = useState(profile.batch);
  const [semester, setSemester] = useState(profile.semester);
  const [whatsapp, setWhatsapp] = useState(profile.whatsappNumber);

  if (!isOpen) return null;

  const dismiss = () => {
    localStorage.setItem('studyos_onboarding_seen', 'true');
    setIsOpen(false);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      batch,
      semester,
      whatsappNumber: whatsapp,
    });
    dismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-3">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome to Your Academic Workspace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            "Plan your day. Master your semester." — Timetable, Tasks &amp; Productivity Dashboard
          </p>
        </div>

        <form onSubmit={handleFinish} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Sharma"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Batch Code
              </label>
              <input
                type="text"
                required
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-medium text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Semester
              </label>
              <input
                type="text"
                required
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              WhatsApp Number for Room Notifications
            </label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-medium text-slate-900 dark:text-white"
            />
          </div>

          <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-3 text-[11px] text-blue-700 dark:text-blue-300 flex items-start gap-2 border border-blue-500/20">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
            <span>
              Your full Batch <strong>{batch}</strong> Semester {semester} timetable with room numbers is pre-configured and ready!
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={dismiss}
              className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-center"
            >
              Explore Default Setup
            </button>
            <button
              type="submit"
              className="flex-2 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:opacity-95 transition cursor-pointer"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
