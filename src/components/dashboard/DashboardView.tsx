import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { 
  Users, DollarSign, Calendar, AlertCircle, TrendingUp, Clock, 
  ShieldAlert, Sparkles, Plus,
  Dumbbell, FileText, Download, Building2, Flame, UserCheck, HeartPulse, RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import confetti from 'canvas-confetti';

export const DashboardView: React.FC = () => {
  const { 
    currentUser,
    stats, 
    sessions, 
    clients, 
    activities, 
    isSkeletonLoading,
    setSelectedClient,
    updateSessionStatus,
    setActiveTab,
    setIsAddClientOpen,
    setIsAddPaymentOpen,
    renewSubscription,
    addToast
  } = useApp();

  // Interactive State
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');

  // Trainer Workout Note State
  const [selectedTrainerClient, setSelectedTrainerClient] = useState(clients[0]?.id || '');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [caloriesBurnedInput, setCaloriesBurnedInput] = useState(450);

  // Dynamic Revenue Trend based on Time Range
  const getRevenueTrend = () => {
    switch (timeRange) {
      case '7d':
        return [
          { month: 'Mon', revenue: 240000, sessions: 35 },
          { month: 'Tue', revenue: 280000, sessions: 42 },
          { month: 'Wed', revenue: 310000, sessions: 45 },
          { month: 'Thu', revenue: 260000, sessions: 40 },
          { month: 'Fri', revenue: 350000, sessions: 48 },
          { month: 'Sat', revenue: 210000, sessions: 32 },
          { month: 'Sun', revenue: 195000, sessions: 18 }
        ];
      case '30d':
        return [
          { month: 'Week 1', revenue: 420000, sessions: 110 },
          { month: 'Week 2', revenue: 460000, sessions: 122 },
          { month: 'Week 3', revenue: 490000, sessions: 130 },
          { month: 'Week 4', revenue: 475000, sessions: 138 }
        ];
      case '90d':
        return [
          { month: 'May', revenue: 1710000, sessions: 410 },
          { month: 'Jun', revenue: 1800000, sessions: 435 },
          { month: 'Jul', revenue: 1845000, sessions: 460 }
        ];
      default:
        return [
          { month: 'Jan', revenue: 1240000, sessions: 280 },
          { month: 'Feb', revenue: 1380000, sessions: 310 },
          { month: 'Mar', revenue: 1490000, sessions: 340 },
          { month: 'Apr', revenue: 1620000, sessions: 380 },
          { month: 'May', revenue: 1710000, sessions: 410 },
          { month: 'Jun', revenue: 1800000, sessions: 435 },
          { month: 'Jul', revenue: 1845000, sessions: 460 }
        ];
    }
  };

  const planDistributionData = [
    { name: '1 Month', value: 25, color: '#3B82F6' },
    { name: '3 Months', value: 45, color: '#10B981' },
    { name: '6 Months', value: 20, color: '#8B5CF6' },
    { name: 'Custom', value: 10, color: '#F59E0B' }
  ];

  const todaysSessions = sessions.filter(s => s.date === '2026-07-30');
  const pendingRenewalClients = clients.filter(c => c.status === 'Pending Renewal');

  const handleCheckIn = (id: string, name: string) => {
    updateSessionStatus(id, 'Completed');
    addToast('Session Completed!', `${name} checked in successfully.`, 'success');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleSaveTrainerWorkoutObservation = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedClient = clients.find(c => c.id === selectedTrainerClient);
    if (!matchedClient || !workoutNotes.trim()) return;

    activities.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
      user: currentUser.name,
      avatar: matchedClient.avatar,
      action: `logged ${caloriesBurnedInput} kcal workout observation: "${workoutNotes}"`,
      target: matchedClient.name,
      type: 'session'
    });

    setWorkoutNotes('');
    addToast('Workout Observations Saved!', `Logged workout data for ${matchedClient.name}.`, 'success');
    confetti({ particleCount: 50, spread: 50 });
  };

  const handleExportCsvReport = (type: string) => {
    addToast('Export Initiated', `Generating ${type} report CSV file...`, 'info');
    setTimeout(() => {
      addToast('Download Complete', `${type}_Export_2026.csv saved to downloads.`, 'success');
    }, 1200);
  };

  // ----------------------------------------------------
  // ROLE 1: SUPER ADMIN DASHBOARD (Aarav Sharma)
  // ----------------------------------------------------
  if (currentUser.role === 'Super Admin') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/10">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                Executive & Financial Command Center
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Good morning, {currentUser.name} 👋
              </h2>
              <p className="text-blue-100 text-sm mt-1 max-w-xl">
                System status: <span className="font-bold text-white">94.2% attendance efficiency</span>. All financial ledgers and staff RBAC systems operational.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsAddClientOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Onboard Member
              </button>
              <button
                onClick={() => setIsAddPaymentOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" /> Log Payment
              </button>
            </div>
          </div>
        </div>

        {/* Executive Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div onClick={() => setActiveTab('clients')} className="cursor-pointer transition-transform hover:-translate-y-1">
            <StatCard title="Active Clients" value={stats.activeClients} change={stats.activeClientsGrowth} icon={Users} subtext="148 active out of 200 capacity →" isLoading={isSkeletonLoading} />
          </div>
          <div onClick={() => setActiveTab('payments')} className="cursor-pointer transition-transform hover:-translate-y-1">
            <StatCard title="Monthly Revenue" value={`₹${stats.monthlyRevenue.toLocaleString('en-IN')}`} change={stats.monthlyRevenueGrowth} icon={DollarSign} subtext="+₹1,85,000 vs target →" isLoading={isSkeletonLoading} />
          </div>
          <div onClick={() => setActiveTab('sessions')} className="cursor-pointer transition-transform hover:-translate-y-1">
            <StatCard title="Today's Sessions" value={`${stats.completedSessionsToday} / ${stats.todaysSessions}`} icon={Calendar} subtext="66% completion rate →" isLoading={isSkeletonLoading} />
          </div>
          <div onClick={() => setActiveTab('payments')} className="cursor-pointer transition-transform hover:-translate-y-1">
            <StatCard title="Pending Payments" value={`₹${stats.pendingAmount.toLocaleString('en-IN')}`} change={-4.2} icon={AlertCircle} subtext={`${stats.pendingPayments} client invoices due →`} isLoading={isSkeletonLoading} />
          </div>
        </div>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Revenue & Collection Velocity
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Executive monthly collection trends</p>
              </div>
              <div className="p-1 rounded-xl bg-gray-100 dark:bg-gray-800 flex gap-1">
                {(['7d', '30d', '90d', 'ytd'] as const).map((range) => (
                  <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${timeRange === range ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-gray-500'}`}>
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getRevenueTrend()}>
                  <defs>
                    <linearGradient id="colorRevAdmin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} tickFormatter={(v) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${v/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', color: '#fff', fontSize: '12px' }} formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevAdmin)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Subscription Mix</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active membership tier breakdown</p>
            </div>
            <div className="h-56 my-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {planDistributionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">148</span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Members</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              {planDistributionData.map((p) => (
                <div key={p.name} onClick={() => setActiveTab('subscriptions')} className="flex items-center gap-2 cursor-pointer">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-gray-600 dark:text-gray-400 truncate">{p.name}:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions & Team Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> Today's Executive Session Schedule
              </h3>
              <button onClick={() => setActiveTab('sessions')} className="text-xs font-bold text-blue-600 hover:underline">View All &rarr;</button>
            </div>
            <div className="space-y-3">
              {todaysSessions.map((session) => (
                <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 gap-3">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedClient(clients.find(c => c.id === session.clientId) || clients[0])}>
                    <img src={session.clientAvatar} alt={session.clientName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div>
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{session.clientName}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{session.serviceType} • {session.time} • Trainer: {session.trainerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={session.status === 'Completed' ? 'success' : 'warning'}>{session.status}</Badge>
                    {session.status === 'Upcoming' && (
                      <button onClick={() => handleCheckIn(session.id, session.clientName)} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">System Activity Feed</h3>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {activities.map((act) => (
                <div key={act.id} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs">
                  <span className="font-bold text-gray-900 dark:text-white">{act.user}</span> {act.action} <span className="font-semibold text-blue-600">{act.target}</span>
                  <span className="text-[10px] text-gray-400 block mt-1">{act.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ROLE 2: CENTER MANAGER DASHBOARD (Kavya Patel)
  // ----------------------------------------------------
  if (currentUser.role === 'Center Manager') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-3">
                <Building2 className="w-3.5 h-3.5 text-blue-300" />
                Facility Operations & Financial Approvals Hub
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {currentUser.name} 👋</h2>
              <p className="text-blue-100 text-sm mt-1 max-w-xl">
                Apex Center Mumbai is at <span className="font-bold text-white">74% capacity</span> (148 active members). 5 membership renewals require action.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button onClick={() => setIsAddClientOpen(true)} className="px-4 py-2.5 rounded-xl bg-white text-indigo-600 font-bold text-xs shadow-md">
                + Onboard Member
              </button>
              <button onClick={() => setIsAddPaymentOpen(true)} className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md">
                + Record Payment
              </button>
            </div>
          </div>
        </div>

        {/* Manager Operational Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Occupancy Capacity" value="148 / 200" icon={Building2} subtext="74% total center space utilized" isLoading={isSkeletonLoading} />
          <StatCard title="Installment Balances" value={`₹${stats.pendingAmount.toLocaleString('en-IN')}`} icon={AlertCircle} subtext="7 client due schedules" isLoading={isSkeletonLoading} />
          <StatCard title="Expiring Memberships" value={pendingRenewalClients.length} icon={RefreshCw} subtext="Requires renewal reachout" isLoading={isSkeletonLoading} />
          <StatCard title="Trainers On Duty" value="3 Trainers" icon={UserCheck} subtext="Shift coverage 100% active" isLoading={isSkeletonLoading} />
        </div>

        {/* Operations Queue & Member Renewals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" /> Pending Membership Renewals Queue
            </h3>
            <p className="text-xs text-gray-500 mb-4">Direct one-click renewal for expiring subscriptions</p>

            <div className="space-y-3">
              {pendingRenewalClients.map((client) => (
                <div key={client.id} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{client.name}</h4>
                      <p className="text-xs text-gray-500">{client.plan} Pass • Assigned Trainer: {client.assignedTrainer}</p>
                    </div>
                  </div>
                  <button onClick={() => renewSubscription(client.id)} className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md">
                    Renew Membership
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Facility Operations Notice</h3>
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 space-y-2">
              <p className="font-bold">📋 Manager Checklist:</p>
              <ul className="list-disc pl-4 space-y-1 opacity-90">
                <li>Review multi-installment cash collection</li>
                <li>Approve trainer shift substitutions</li>
                <li>Verify monthly revenue targets</li>
              </ul>
            </div>
            <button onClick={() => setActiveTab('subscriptions')} className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md">
              Manage All Subscriptions &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ROLE 3: HEAD TRAINER DASHBOARD (Marcus Vance)
  // ----------------------------------------------------
  if (currentUser.role === 'Head Trainer') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-3">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-300" />
                Daily Appointment & Client Workout Portal
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {currentUser.name} 👋</h2>
              <p className="text-emerald-100 text-sm mt-1 max-w-xl">
                You have <span className="font-bold text-white">8 personal training sessions</span> scheduled today. 5 clients checked in cleanly.
              </p>
            </div>
          </div>
        </div>

        {/* Trainer Specific Workout Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="My Today's Sessions" value="8 Scheduled" icon={Calendar} subtext="5 Completed • 3 Upcoming" isLoading={isSkeletonLoading} />
          <StatCard title="Client Attendance" value="94.2%" icon={UserCheck} subtext="Consistent attendance rate" isLoading={isSkeletonLoading} />
          <StatCard title="Client Health Index" value="89 / 100" icon={HeartPulse} subtext="Average fitness progression" isLoading={isSkeletonLoading} />
          <StatCard title="Assigned Members" value="32 Clients" icon={Users} subtext="Personal training roster" isLoading={isSkeletonLoading} />
        </div>

        {/* Workout Schedule & Observations Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" /> My Training Appointment Schedule
            </h3>
            <div className="space-y-3">
              {todaysSessions.map((session) => (
                <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 gap-3">
                  <div className="flex items-center gap-3">
                    <img src={session.clientAvatar} alt={session.clientName} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{session.clientName}</h4>
                      <p className="text-xs text-gray-500">{session.serviceType} • {session.time} ({session.durationMinutes}m)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={session.status === 'Completed' ? 'success' : 'warning'}>{session.status}</Badge>
                    {session.status === 'Upcoming' && (
                      <button onClick={() => handleCheckIn(session.id, session.clientName)} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md">
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trainer Workout Observation Logger */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" /> Log Workout Observations
            </h3>

            <form onSubmit={handleSaveTrainerWorkoutObservation} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Select Client</label>
                <select value={selectedTrainerClient} onChange={(e) => setSelectedTrainerClient(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium">
                  {clients.map(c => (<option key={c.id} value={c.id}>{c.name} ({c.plan})</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Calories Burned (kcal)</label>
                <input type="number" value={caloriesBurnedInput} onChange={(e) => setCaloriesBurnedInput(Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Workout Notes & Form Feedback</label>
                <textarea rows={3} value={workoutNotes} onChange={(e) => setWorkoutNotes(e.target.value)} placeholder="e.g. Completed 4 sets deadlifts at 110kg. Form improved..." className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium" />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md">
                Save Trainer Observation
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ROLE 4: STAFF ANALYST DASHBOARD (Ananya Roy)
  // ----------------------------------------------------
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-3">
              <FileText className="w-3.5 h-3.5 text-purple-300" />
              Data Analytics & Intelligence Insights Hub
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {currentUser.name} 👋</h2>
            <p className="text-purple-100 text-sm mt-1 max-w-xl">
              Member retention velocity is at <span className="font-bold text-white">91.4%</span> with +12.5% Month-over-Month growth index.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button onClick={() => handleExportCsvReport('Client_Analytics')} className="px-4 py-2.5 rounded-xl bg-white text-purple-700 font-bold text-xs shadow-md flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Export CSV Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Analyst Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Retention Index" value="91.4%" change={3.2} icon={TrendingUp} subtext="Strong client retention velocity" isLoading={isSkeletonLoading} />
        <StatCard title="Attendance Rate" value="94.2%" change={1.5} icon={UserCheck} subtext="Overall attendance consistency" isLoading={isSkeletonLoading} />
        <StatCard title="Member Growth" value="+12.5%" change={12.5} icon={Users} subtext="Month-over-Month increase" isLoading={isSkeletonLoading} />
        <StatCard title="Avg Membership" value="4.2 Months" icon={Clock} subtext="Average plan duration" isLoading={isSkeletonLoading} />
      </div>

      {/* Analytics Comparative Matrix & CSV Downloader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Comparative Session & Attendance Matrix</h3>
              <p className="text-xs text-gray-500">Historical performance trends over time</p>
            </div>
            <div className="p-1 rounded-xl bg-gray-100 dark:bg-gray-800 flex gap-1">
              {(['7d', '30d', '90d', 'ytd'] as const).map((range) => (
                <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${timeRange === range ? 'bg-white dark:bg-gray-900 text-purple-600 shadow-xs' : 'text-gray-500'}`}>
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getRevenueTrend()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="sessions" stroke="#8B5CF6" strokeWidth={3} fill="#8B5CF6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analyst Export & Reports Box */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">CSV Export Center</h3>
          <p className="text-xs text-gray-500">Download raw data for external reporting</p>
          <div className="space-y-3">
            <button onClick={() => handleExportCsvReport('Client_Directory')} className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-bold text-xs text-gray-800 dark:text-gray-200 flex items-center justify-between">
              <span>Client Directory CSV</span>
              <Download className="w-4 h-4 text-purple-600" />
            </button>
            <button onClick={() => handleExportCsvReport('Attendance_Log')} className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-bold text-xs text-gray-800 dark:text-gray-200 flex items-center justify-between">
              <span>Attendance Log CSV</span>
              <Download className="w-4 h-4 text-purple-600" />
            </button>
            <button onClick={() => handleExportCsvReport('Financial_Ledger')} className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-bold text-xs text-gray-800 dark:text-gray-200 flex items-center justify-between">
              <span>Financial Ledger CSV</span>
              <Download className="w-4 h-4 text-purple-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
