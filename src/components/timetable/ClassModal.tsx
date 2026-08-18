import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, BookOpen, Layers, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimetableClass, DayOfWeek, ClassType } from '../../types';

export const ClassModal: React.FC = () => {
  const {
    classModalOpen,
    closeClassModal,
    editingClass,
    addClass,
    updateClass,
    deleteClass,
    subjects,
    profile,
  } = useApp();

  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [startTime, setStartTime] = useState('09:30');
  const [endTime, setEndTime] = useState('10:30');
  const [subjectId, setSubjectId] = useState('');
  const [type, setType] = useState<ClassType>('Lecture');
  const [room, setRoom] = useState('');
  const [faculty, setFaculty] = useState('');
  const [batch, setBatch] = useState(profile.batch);
  const [notes, setNotes] = useState('');

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (editingClass && editingClass.id) {
      setDay(editingClass.day);
      setStartTime(editingClass.startTime);
      setEndTime(editingClass.endTime);
      setSubjectId(editingClass.subjectId);
      setType(editingClass.type);
      setRoom(editingClass.room || '');
      setFaculty(editingClass.faculty || '');
      setBatch(editingClass.batch || profile.batch);
      setNotes(editingClass.notes || '');
    } else {
      setDay(editingClass?.day || 'Monday');
      setStartTime('09:30');
      setEndTime('10:30');
      setSubjectId(subjects[0]?.id || '');
      setType('Lecture');
      setRoom(subjects[0]?.defaultRoom || '3102-BL3-GF');
      setFaculty(subjects[0]?.faculty || '');
      setBatch(profile.batch);
      setNotes('');
    }
  }, [editingClass, subjects, profile.batch]);

  if (!classModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selSubject = subjects.find((s) => s.id === subjectId);
    const subjectName = selSubject ? selSubject.name : 'Custom Class';

    if (editingClass && editingClass.id) {
      updateClass(editingClass.id, {
        day,
        startTime,
        endTime,
        subjectId,
        subjectName,
        type,
        room,
        faculty,
        batch,
        notes,
      });
    } else {
      addClass({
        day,
        startTime,
        endTime,
        subjectId,
        subjectName,
        type,
        room,
        faculty,
        batch,
        notes,
      });
    }
    closeClassModal();
  };

  const handleDelete = () => {
    if (editingClass && editingClass.id) {
      deleteClass(editingClass.id);
      closeClassModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={closeClassModal} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingClass?.id ? 'Edit Timetable Slot' : 'Add Class / Lab Session'}
            </h3>
          </div>
          <button
            onClick={closeClassModal}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Day of Week
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  const sub = subjects.find((s) => s.id === e.target.value);
                  if (sub) {
                    if (sub.defaultRoom) setRoom(sub.defaultRoom);
                    if (sub.faculty) setFaculty(sub.faculty);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Start & End */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Start Time
              </label>
              <input
                type="text"
                placeholder="09:30"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                End Time
              </label>
              <input
                type="text"
                placeholder="10:30"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Type & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Session Type
              </label>
              <div className="flex gap-2">
                {(['Lecture', 'Lab', 'Tutorial'] as ClassType[]).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition ${
                      type === t
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Room No / Lab Venue
              </label>
              <input
                type="text"
                placeholder="e.g. 8108-BL8-FF"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Faculty & Batch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Faculty / Professor
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Rajesh Sharma"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Batch
              </label>
              <input
                type="text"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Slot Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Bring lab manual or laptop"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            {editingClass?.id ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Slot
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeClassModal}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
              >
                {editingClass?.id ? 'Save Changes' : 'Create Class'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
