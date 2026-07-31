import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import type { Session } from '../../types';
import { 
  Clock, CheckCircle2, XCircle, 
  Flame, Edit3, ChevronLeft, ChevronRight
} from 'lucide-react';

export const SessionsView: React.FC = () => {
  const { sessions, updateSessionStatus } = useApp();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const [editNotes, setEditNotes] = useState('');
  const [editCalories, setEditCalories] = useState(450);

  const handleOpenNotes = (session: Session) => {
    setSelectedSession(session);
    setEditNotes(session.trainerNotes || '');
    setEditCalories(session.caloriesBurned || 450);
  };

  const handleSaveNotes = () => {
    if (!selectedSession) return;
    updateSessionStatus(selectedSession.id, selectedSession.status, editNotes, editCalories);
    setSelectedSession(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Daily Session Tracking & Attendance
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time appointment schedule, workout logging, and calories tracking
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="p-1 rounded-xl bg-gray-200 dark:bg-gray-800 flex gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'
              }`}
            >
              List Schedule
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'calendar' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'
              }`}
            >
              Monthly Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid View */}
      {viewMode === 'calendar' ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">July 2026 Schedule</h3>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-xs font-bold">July 2026</span>
              <button className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 mb-2">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const daySessions = sessions.filter(s => s.date === dateStr);
              const isToday = dayNum === 30;

              return (
                <div
                  key={dayNum}
                  className={`min-h-24 p-2 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isToday
                      ? 'bg-blue-500/10 border-blue-500/40'
                      : 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-200/60 dark:border-gray-800'
                  }`}
                >
                  <span className={`text-xs font-bold ${isToday ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-gray-700 dark:text-gray-300'}`}>
                    {dayNum}
                  </span>

                  <div className="space-y-1 my-1">
                    {daySessions.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleOpenNotes(s)}
                        className="p-1 rounded-md bg-blue-600 text-white text-[10px] truncate cursor-pointer font-medium hover:opacity-90"
                      >
                        {s.time} {s.clientName.split(' ')[0]}
                      </div>
                    ))}
                  </div>

                  <span className="text-[9px] text-gray-400">{daySessions.length} sessions</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List Schedule View */
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/40 transition-all"
            >
              <div className="flex items-center gap-4">
                <img
                  src={session.clientAvatar}
                  alt={session.clientName}
                  className="w-12 h-12 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{session.clientName}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold">
                      {session.serviceType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    <Clock className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                    {session.date} at {session.time} ({session.durationMinutes} mins) • Trainer: {session.trainerName}
                  </p>
                  {session.workoutSummary && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 font-mono bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                      {session.workoutSummary}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
                {session.caloriesBurned && (
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    <Flame className="w-4 h-4" /> {session.caloriesBurned} kcal
                  </span>
                )}

                <Badge
                  variant={
                    session.status === 'Completed' ? 'success' :
                    session.status === 'In Progress' ? 'info' :
                    session.status === 'Missed' ? 'danger' : 'warning'
                  }
                >
                  {session.status}
                </Badge>

                {/* Status Switcher Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateSessionStatus(session.id, 'Completed')}
                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                    title="Mark Completed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => updateSessionStatus(session.id, 'Missed')}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                    title="Mark Missed"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenNotes(session)}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                    title="Edit Trainer Notes"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trainer Notes Modal */}
      {selectedSession && (
        <Modal
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
          title={`Log Notes - ${selectedSession.clientName}`}
          subtitle="Record exercise sets, calories, and recovery observations"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Workout & Trainer Observations
              </label>
              <textarea
                rows={4}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Enter workout breakdown, weight lifted, posture observations..."
                className="w-full p-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Estimated Calories Burned (kcal)
              </label>
              <input
                type="number"
                value={editCalories}
                onChange={(e) => setEditCalories(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium"
              />
            </div>

            <button
              onClick={handleSaveNotes}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
            >
              Save Trainer Session Record
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
