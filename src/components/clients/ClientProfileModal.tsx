import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { 
  Phone, Mail, Calendar, TrendingDown
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ClientProfileModal: React.FC = () => {
  const { selectedClient, setSelectedClient, renewSubscription, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'payments' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');

  if (!selectedClient) return null;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addToast('Note Saved', 'Trainer observation saved to client record.', 'success');
    selectedClient.notes = `${selectedClient.notes}\n• [${new Date().toLocaleDateString()}] ${newNote}`;
    setNewNote('');
  };

  return (
    <Modal
      isOpen={!!selectedClient}
      onClose={() => setSelectedClient(null)}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Profile Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-slate-900 text-white shadow-xl gap-4">
          <div className="flex items-center gap-4">
            <img
              src={selectedClient.avatar}
              alt={selectedClient.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold">{selectedClient.name}</h2>
                <Badge variant={selectedClient.status === 'Active' ? 'success' : selectedClient.status === 'Pending Renewal' ? 'warning' : 'danger'}>
                  {selectedClient.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-300 mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-400" /> {selectedClient.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-400" /> {selectedClient.phone}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-400" /> Member since {selectedClient.joinDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Health Index</span>
              <span className="text-2xl font-extrabold text-emerald-400">{selectedClient.healthScore}/100</span>
            </div>
            <button
              onClick={() => renewSubscription(selectedClient.id)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              Renew Membership
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
          {(['overview', 'sessions', 'payments', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500">Current Weight</span>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{selectedClient.currentWeightKg} kg</p>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-0.5">
                  <TrendingDown className="w-3 h-3" /> Target: {selectedClient.targetWeightKg} kg
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500">BMI Score</span>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{selectedClient.bmi}</p>
                <span className="text-[10px] text-blue-500 font-semibold mt-0.5 block">Normal Range (18.5 - 24.9)</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500">Assigned Trainer</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{selectedClient.assignedTrainer}</p>
                <span className="text-[10px] text-gray-400 mt-0.5 block">Head Specialist</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500">Plan Tier</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{selectedClient.plan}</p>
                <span className="text-[10px] text-amber-500 font-semibold mt-0.5 block">Active Auto-renewal</span>
              </div>
            </div>

            {/* Weight Loss Progress Chart */}
            <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                Weight & Body Composition Trajectory
              </h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedClient.weightHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} />
                    <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '10px', color: '#fff', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="weightKg" stroke="#2563EB" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 365-day Attendance Heatmap Grid */}
            <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  90-Day Attendance Matrix
                </h4>
                <span className="text-xs font-bold text-emerald-500">92% Attendance Rate</span>
              </div>
              <div className="grid grid-cols-15 sm:grid-cols-30 gap-1.5 pt-2">
                {selectedClient.attendanceHistory.map((day, idx) => (
                  <div
                    key={idx}
                    title={`${day.date}: ${day.count > 0 ? 'Attended' : 'Missed'}`}
                    className={`h-4 rounded-xs transition-transform hover:scale-125 ${
                      day.count > 0 
                        ? 'bg-emerald-500 shadow-2xs shadow-emerald-500/50' 
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 whitespace-pre-line text-sm text-gray-800 dark:text-gray-200 font-mono">
              {selectedClient.notes || 'No notes added yet.'}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add trainer observation..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium focus:outline-none"
              />
              <button
                onClick={handleAddNote}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Save Note
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
