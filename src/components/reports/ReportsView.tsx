import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { attendanceDistributionData } from '../../mock/data';

export const ReportsView: React.FC = () => {
  const { clients, sessions, addToast } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');

  const totalSessions = sessions.length;
  const completedCount = sessions.filter(s => s.status === 'Completed').length;
  const missedCount = sessions.filter(s => s.status === 'Missed').length;
  const attendancePct = Math.round((completedCount / (totalSessions || 1)) * 100);

  const handleExportCSV = () => {
    const headers = ['Client ID', 'Name', 'Email', 'Plan', 'Status', 'Health Score', 'BMI', 'Current Weight (kg)'];
    const rows = clients.map(c => [
      c.id,
      `"${c.name}"`,
      c.email,
      c.plan,
      c.status,
      c.healthScore,
      c.bmi,
      c.currentWeightKg
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `KineticOS_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('CSV Download Started', 'Exported client health and billing report.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Performance & Analytics Reports
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Exportable audit trails for attendance rates, cohort body composition, and financial performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Range Filter */}
          <div className="p-1 rounded-xl bg-gray-200 dark:bg-gray-800 flex gap-1">
            {(['7d', '30d', '90d', 'ytd'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  timeRange === range ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Aggregate Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-bold uppercase text-gray-400">Attendance Efficiency</span>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">{attendancePct}%</div>
          <span className="text-[11px] text-emerald-500 font-semibold mt-1 block">+3.4% vs last cohort</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-bold uppercase text-gray-400">Completed Sessions</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{completedCount}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">Logged by head trainers</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-bold uppercase text-gray-400">Missed / Cancelled</span>
          <div className="text-3xl font-black text-rose-500 mt-1">{missedCount}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">Requires follow-up calls</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-bold uppercase text-gray-400">Avg Member Weight Loss</span>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">-3.8 kg</div>
          <span className="text-[11px] text-gray-500 mt-1 block">Over 90-day cycle</span>
        </div>
      </div>

      {/* Attendance Distribution Chart */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Weekly Session Distribution & Compliance
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
              <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="completed" fill="#22C55E" radius={[6, 6, 0, 0]} name="Completed" />
              <Bar dataKey="missed" fill="#EF4444" radius={[6, 6, 0, 0]} name="Missed" />
              <Bar dataKey="cancelled" fill="#6B7280" radius={[6, 6, 0, 0]} name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
