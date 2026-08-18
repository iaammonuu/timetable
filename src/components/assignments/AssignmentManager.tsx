import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Calendar,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Assignment, AssignmentStatus, TaskPriority } from '../../types';

export const AssignmentManager: React.FC = () => {
  const {
    assignments,
    subjects,
    addAssignment,
    updateAssignment,
    deleteAssignment,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Today' | 'This Week' | 'High Priority' | 'Completed'>('All');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsg, setEditingAsg] = useState<Assignment | null>(null);

  // Modal Form state
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [status, setStatus] = useState<AssignmentStatus>('In Progress');
  const [estimatedHours, setEstimatedHours] = useState(3);
  const [completionPercentage, setCompletionPercentage] = useState(40);

  const openNewModal = () => {
    setEditingAsg(null);
    setTitle('');
    setSubjectId(subjects[0]?.id || '');
    setDescription('');
    setDueDate(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
    setPriority('High');
    setStatus('In Progress');
    setEstimatedHours(3);
    setCompletionPercentage(0);
    setModalOpen(true);
  };

  const openEditModal = (asg: Assignment) => {
    setEditingAsg(asg);
    setTitle(asg.title);
    setSubjectId(asg.subjectId);
    setDescription(asg.description);
    setDueDate(asg.dueDate);
    setPriority(asg.priority);
    setStatus(asg.status);
    setEstimatedHours(asg.estimatedHours);
    setCompletionPercentage(asg.completionPercentage);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingAsg) {
      updateAssignment(editingAsg.id, {
        title,
        subjectId,
        description,
        dueDate,
        priority,
        status,
        estimatedHours,
        completionPercentage,
      });
    } else {
      addAssignment({
        title,
        subjectId,
        description,
        dueDate,
        priority,
        status,
        estimatedHours,
        completionPercentage,
      });
    }
    setModalOpen(false);
  };

  // Filter logic
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000);

  const filteredAssignments = assignments.filter((a) => {
    if (activeFilter === 'Completed') return a.status === 'Completed';
    if (activeFilter === 'High Priority') return a.priority === 'High' || a.priority === 'Urgent';
    if (activeFilter === 'Today') return a.dueDate === todayStr;
    if (activeFilter === 'This Week') {
      const d = new Date(a.dueDate);
      return d >= now && d <= nextWeek;
    }
    return true;
  });

  const kanbanColumns: { status: AssignmentStatus; label: string; color: string }[] = [
    { status: 'Not Started', label: 'Not Started', color: 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800' },
    { status: 'In Progress', label: 'In Progress', color: 'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40' },
    { status: 'Completed', label: 'Completed', color: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40' },
    { status: 'Overdue', label: 'Overdue', color: 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Assignment &amp; Lab Reports Manager
            </h1>
            <span className="rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold text-xs px-2.5 py-0.5">
              {assignments.filter((a) => a.status !== 'Completed').length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track submission deadlines, estimated effort, priority levels, and completion status
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'kanban'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={openNewModal}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3">
        {(['All', 'Today', 'This Week', 'High Priority', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              activeFilter === tab
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const colItems = filteredAssignments.filter((a) => a.status === col.status);

            return (
              <div
                key={col.status}
                className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4"
              >
                {/* Col Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      {col.label}
                    </h3>
                  </div>
                  <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {colItems.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[560px] pr-1">
                  {colItems.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No assignments in {col.label}
                    </div>
                  ) : (
                    colItems.map((item) => {
                      const sub = subjects.find((s) => s.id === item.subjectId);

                      return (
                        <div
                          key={item.id}
                          onClick={() => openEditModal(item)}
                          className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xs hover:shadow-md hover:border-blue-400 cursor-pointer transition"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 truncate max-w-[130px]">
                              {sub?.name || 'Subject'}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                item.priority === 'Urgent'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                  : item.priority === 'High'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                            {item.title}
                          </h4>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Progress */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                              <span>Due: {item.dueDate}</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {item.completionPercentage}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${item.completionPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3.5 font-semibold">Assignment Title</th>
                <th className="p-3.5 font-semibold">Subject</th>
                <th className="p-3.5 font-semibold">Due Date</th>
                <th className="p-3.5 font-semibold">Priority</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Progress</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAssignments.map((a) => {
                const sub = subjects.find((s) => s.id === a.subjectId);
                return (
                  <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white max-w-xs">
                      {a.title}
                    </td>
                    <td className="p-3.5 text-blue-600 dark:text-blue-400 font-medium">
                      {sub?.name || 'General'}
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                      {a.dueDate}
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {a.priority}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-200">
                      {a.status}
                    </td>
                    <td className="p-3.5 font-mono">{a.completionPercentage}%</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openEditModal(a)}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl z-10 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingAsg ? 'Edit Assignment' : 'Create Assignment'}
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
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS EC2 & S3 Deployment Terraform Script"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description / Requirements
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details, submission portal link, or specific rubrics..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Completion %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={completionPercentage}
                    onChange={(e) => setCompletionPercentage(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                {editingAsg ? (
                  <button
                    type="button"
                    onClick={() => {
                      deleteAssignment(editingAsg.id);
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
                    Save Assignment
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
