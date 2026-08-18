import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Exam } from '../../types';

export const ExamPlanner: React.FC = () => {
  const {
    exams,
    subjects,
    addExam,
    updateExam,
    deleteExam,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // Form
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [title, setTitle] = useState('Mid-Term Examination');
  const [date, setDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 - 13:00');
  const [room, setRoom] = useState('8108-BL8-FF');
  const [syllabusPercentage, setSyllabusPercentage] = useState(60);
  const [weightage, setWeightage] = useState('30% Internal');

  const openNewExamModal = () => {
    setEditingExam(null);
    setSubjectId(subjects[0]?.id || '');
    setTitle('Mid-Semester Examination');
    setDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
    setTime('10:00 - 13:00');
    setRoom('8108-BL8-FF');
    setSyllabusPercentage(50);
    setWeightage('30%');
    setModalOpen(true);
  };

  const openEditExamModal = (exam: Exam) => {
    setEditingExam(exam);
    setSubjectId(exam.subjectId);
    setTitle(exam.title);
    setDate(exam.date);
    setTime(exam.time);
    setRoom(exam.room || '');
    setSyllabusPercentage(exam.syllabusPercentage);
    setWeightage(exam.weightage || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExam) {
      updateExam(editingExam.id, {
        subjectId,
        title,
        date,
        time,
        room,
        syllabusPercentage,
        weightage,
      });
    } else {
      addExam({
        subjectId,
        title,
        date,
        time,
        room,
        syllabusPercentage,
        weightage,
      });
    }
    setModalOpen(false);
  };

  const calculateDaysLeft = (examDate: string) => {
    const target = new Date(examDate).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Exam Countdown &amp; Revision Planner
            </h1>
            <span className="rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-semibold text-xs px-2.5 py-0.5">
              {exams.length} Upcoming Exams
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Days remaining, syllabus readiness percentages, exam halls, and weightages
          </p>
        </div>

        <button
          onClick={openNewExamModal}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add Exam</span>
        </button>
      </div>

      {/* Countdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.map((exam) => {
          const sub = subjects.find((s) => s.id === exam.subjectId);
          const daysLeft = calculateDaysLeft(exam.date);
          const isUrgent = daysLeft <= 7 && daysLeft >= 0;

          return (
            <div
              key={exam.id}
              onClick={() => openEditExamModal(exam)}
              className={`rounded-2xl border p-5 shadow-xs flex flex-col justify-between cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
                isUrgent
                  ? 'border-red-400/80 bg-red-50/20 dark:bg-red-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div>
                {/* Top Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {sub?.name || 'Subject'}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                      daysLeft <= 3
                        ? 'bg-red-600 text-white animate-pulse'
                        : daysLeft <= 7
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {daysLeft > 0 ? `${daysLeft} Days Left` : daysLeft === 0 ? 'Today!' : 'Passed'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-3">
                  {exam.title}
                </h3>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{exam.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-red-500" />
                    <span>Hall: {exam.room || 'TBA'}</span>
                  </div>
                  {exam.weightage && (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Weightage: {exam.weightage}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Syllabus Preparedness */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-600 dark:text-slate-400">Syllabus Prepared</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {exam.syllabusPercentage}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      exam.syllabusPercentage >= 80
                        ? 'bg-emerald-500'
                        : exam.syllabusPercentage >= 50
                        ? 'bg-blue-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${exam.syllabusPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Exam Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl z-10 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingExam ? 'Edit Exam' : 'Schedule Exam'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Exam Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-Term Examination"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Subject
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Time Window
                  </label>
                  <input
                    type="text"
                    placeholder="10:00 - 13:00"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Hall / Room No
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8108-BL8-FF"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Syllabus Prepared %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={syllabusPercentage}
                    onChange={(e) => setSyllabusPercentage(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                {editingExam ? (
                  <button
                    type="button"
                    onClick={() => {
                      deleteExam(editingExam.id);
                      setModalOpen(false);
                    }}
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    Save Exam
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
