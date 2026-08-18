import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  MessageCircle,
  Sparkles,
  Phone,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DayOfWeek } from '../../types';
import {
  formatWhatsAppDailySchedule,
  formatWhatsAppFullWeekSchedule,
  getWhatsAppShareUrl,
} from '../../utils/whatsapp';

export const WhatsAppModal: React.FC = () => {
  const {
    whatsAppModalOpen,
    closeWhatsAppModal,
    whatsAppDay,
    timetable,
    profile,
    updateProfile,
    showToast,
  } = useApp();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'Week'>('Monday');
  const [phoneNumber, setPhoneNumber] = useState(profile.whatsappNumber || '9334005518');
  const [copied, setCopied] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    if (whatsAppDay) {
      setSelectedDay(whatsAppDay);
    }
  }, [whatsAppDay]);

  if (!whatsAppModalOpen) return null;

  // Generate Message
  let messageContent = '';
  if (selectedDay === 'Week') {
    messageContent = formatWhatsAppFullWeekSchedule(timetable, profile.batch, profile.name);
  } else {
    messageContent = formatWhatsAppDailySchedule(
      timetable,
      selectedDay,
      profile.batch,
      profile.name
    );
  }

  const shareUrl = getWhatsAppShareUrl(phoneNumber, messageContent);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageContent);
      setCopied(true);
      showToast('Timetable copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
  };

  const handleSendDirect = () => {
    updateProfile({ whatsappNumber: phoneNumber });
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    showToast('Opening WhatsApp...', 'info');
  };

  const handleSimulateApiNotification = () => {
    setApiSuccess(true);
    showToast(`Automated WhatsApp dispatch sent to +91 ${phoneNumber}`, 'success');
    setTimeout(() => setApiSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={closeWhatsAppModal} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                WhatsApp Day-Wise Room Dispatch
              </h3>
              <p className="text-[11px] text-slate-400">
                Send official room numbers &amp; timetable to WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={closeWhatsAppModal}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Day Selector Pills */}
        <div className="space-y-3 mb-4">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Select Day / Schedule Scope
          </label>
          <div className="flex flex-wrap gap-1.5">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  selectedDay === d
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => setSelectedDay('Week')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedDay === 'Week'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Full Week (Mon-Fri)
            </button>
          </div>
        </div>

        {/* Target WhatsApp Phone Number */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Recipient WhatsApp Number
          </label>
          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              +91
            </span>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="9334005518"
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Message Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Formatted Message Preview:
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied!' : 'Copy text'}</span>
            </button>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 text-[11px] font-mono text-emerald-400 border border-slate-800 max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
            {messageContent}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            <span>Copy Text</span>
          </button>

          <button
            onClick={handleSendDirect}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            <Send className="h-4 w-4" />
            <span>Open in WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
