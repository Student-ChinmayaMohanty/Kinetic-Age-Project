import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { 
  Users, DollarSign, Calendar, AlertCircle, TrendingUp, Clock, 
  CheckCircle2, ArrowUpRight, ShieldAlert, Sparkles, Activity, Plus, Send
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import confetti from 'canvas-confetti';

export const DashboardView: React.FC = () => {
  const { 
    stats, 
    sessions, 
    clients, 
    activities, 
    isSkeletonLoading,
    setSelectedClient,
    updateSessionStatus,
    setActiveTab,
    setIsAddClientOpen,
    recordPayment,
    hasPermission,
    addToast
  } = useApp();

  // Interactive State
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');
  const [activityFilter, setActivityFilter] = useState<'all' | 'session' | 'payment' | 'subscription' | 'client'>('all');
  const [quickActivityText, setQuickActivityText] = useState('');
  const [isQuickLogPaymentOpen, setIsQuickLogPaymentOpen] = useState(false);

  const canOnboard = hasPermission('onboard_client');
  const canLogPayment = hasPermission('log_payment');
  const canCheckIn = hasPermission('checkin_session');

  // Quick Payment Form State
  const [quickPaymentClient, setQuickPaymentClient] = useState(clients[0]?.id || '');
  const [quickPaymentAmount, setQuickPaymentAmount] = useState(19500);
  const [quickPaymentMethod, setQuickPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Cash' | 'Bank Transfer'>('UPI');

  // Dynamic Chart & Stat Data based on Time Range
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

  const filteredActivities = activities.filter(
    a => activityFilter === 'all' || a.type === activityFilter
  );

  const handleCheckIn = (id: string, name: string) => {
    updateSessionStatus(id, 'Completed');
    addToast('Session Completed!', `${name} checked in successfully.`, 'success');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handlePostQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickActivityText.trim()) return;
    activities.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
      user: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      action: 'posted team note:',
      target: `"${quickActivityText}"`,
      type: 'session'
    });
    setQuickActivityText('');
    addToast('Note Posted', 'Broadcasted update to team activity stream.', 'info');
  };

  const handleQuickLogPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const clientObj = clients.find(c => c.id === quickPaymentClient) || clients[0];
    recordPayment({
      clientId: clientObj.id,
      clientName: clientObj.name,
      planName: clientObj.plan,
      amount: Number(quickPaymentAmount),
      paidAmount: Number(quickPaymentAmount),
      method: quickPaymentMethod
    });
    setIsQuickLogPaymentOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner with Interactive Quick Triggers */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/10">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              KineticOS v2.4 Enterprise • India Edition
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, Aarav 👋
            </h2>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Apex Fitness Center - Mumbai is running at <span className="font-bold text-white">94.2% attendance efficiency</span> today. You have {todaysSessions.filter(s => s.status === 'Upcoming').length} upcoming sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (!canOnboard) {
                  addToast('Function Disabled', 'Super Admin or Manager sign-in required to onboard members.', 'danger');
                  return;
                }
                setIsAddClientOpen(true);
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
                canOnboard 
                  ? 'bg-white text-blue-600 hover:bg-blue-50 active:scale-95' 
                  : 'bg-gray-200/40 text-gray-300 cursor-not-allowed opacity-75'
              }`}
              title={canOnboard ? 'Onboard Member' : 'Locked - Admin Auth Required'}
            >
              <Plus className="w-4 h-4" /> Onboard Member {!canOnboard && '🔒'}
            </button>

            <button
              onClick={() => {
                if (!canLogPayment) {
                  addToast('Function Disabled', 'Super Admin or Manager sign-in required to record payments.', 'danger');
                  return;
                }
                setIsQuickLogPaymentOpen(true);
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs border backdrop-blur-md transition-all flex items-center gap-1.5 ${
                canLogPayment 
                  ? 'bg-blue-500/30 text-white border-white/20 hover:bg-blue-500/40 active:scale-95' 
                  : 'bg-gray-800/40 text-gray-400 border-gray-700/50 cursor-not-allowed opacity-75'
              }`}
              title={canLogPayment ? 'Log Payment' : 'Locked - Admin Auth Required'}
            >
              <DollarSign className="w-4 h-4" /> Log Payment {!canLogPayment && '🔒'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Top Stat Grid with Interactive Click Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('clients')}
          className="cursor-pointer transition-transform hover:-translate-y-1"
          title="Click to manage client directory"
        >
          <StatCard
            title="Active Clients"
            value={stats.activeClients}
            change={stats.activeClientsGrowth}
            icon={Users}
            subtext="148 active out of 200 capacity →"
            isLoading={isSkeletonLoading}
          />
        </div>

        <div 
          onClick={() => setActiveTab('payments')}
          className="cursor-pointer transition-transform hover:-translate-y-1"
          title="Click to view financial ledger"
        >
          <StatCard
            title="Monthly Revenue"
            value={`₹${stats.monthlyRevenue.toLocaleString('en-IN')}`}
            change={stats.monthlyRevenueGrowth}
            icon={DollarSign}
            subtext="+₹1,85,000 vs last month target →"
            isLoading={isSkeletonLoading}
          />
        </div>

        <div 
          onClick={() => setActiveTab('sessions')}
          className="cursor-pointer transition-transform hover:-translate-y-1"
          title="Click to open session calendar"
        >
          <StatCard
            title="Today's Sessions"
            value={`${stats.completedSessionsToday} / ${stats.todaysSessions}`}
            icon={Calendar}
            subtext="66% completion rate so far →"
            isLoading={isSkeletonLoading}
          />
        </div>

        <div 
          onClick={() => setActiveTab('payments')}
          className="cursor-pointer transition-transform hover:-translate-y-1"
          title="Click to review pending invoices"
        >
          <StatCard
            title="Pending Payments"
            value={`₹${stats.pendingAmount.toLocaleString('en-IN')}`}
            change={-4.2}
            icon={AlertCircle}
            subtext={`${stats.pendingPayments} client invoices due →`}
            isLoading={isSkeletonLoading}
          />
        </div>
      </div>

      {/* Charts Section with Real-Time Interactive Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Revenue & Workout Growth Matrix
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Dynamic revenue performance with total completed workouts
              </p>
            </div>

            {/* Interactive Time Range Filter Selector */}
            <div className="p-1 rounded-xl bg-gray-100 dark:bg-gray-800 flex gap-1 self-start sm:self-center">
              {(['7d', '30d', '90d', 'ytd'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    timeRange === range
                      ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs scale-105'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getRevenueTrend()} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" tickFormatter={(v) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    borderColor: '#374151', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Plan Distribution Donut Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
              Subscription Mix
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active plan breakdown across members
            </p>
          </div>

          <div className="h-56 my-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {planDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="cursor-pointer hover:opacity-80 transition-opacity" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">148</span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Members</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
            {planDistributionData.map((p) => (
              <div 
                key={p.name} 
                onClick={() => setActiveTab('subscriptions')}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-gray-600 dark:text-gray-400 truncate">{p.name}:</span>
                <span className="font-bold text-gray-900 dark:text-white">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Interactive Today's Sessions & Interactive Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Upcoming Sessions List with Interactive 1-Click Check-in */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Today's Session Schedule (July 30, 2026)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Click member profile or 1-click check-in for daily appointments
              </p>
            </div>
            <button
              onClick={() => setActiveTab('sessions')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Full Calendar <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todaysSessions.map((session) => {
              const matchedClient = clients.find(c => c.id === session.clientId) || clients[0];

              return (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-blue-500/40 transition-all gap-3"
                >
                  <div 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setSelectedClient(matchedClient)}
                    title="Click to view member profile"
                  >
                    <img
                      src={session.clientAvatar}
                      alt={session.clientName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700 group-hover:border-blue-500 transition-colors"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {session.clientName}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                          {session.serviceType}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {session.time} ({session.durationMinutes}m) • Trainer: {session.trainerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Badge
                      variant={
                        session.status === 'Completed' ? 'success' :
                        session.status === 'In Progress' ? 'info' :
                        session.status === 'Missed' ? 'danger' : 'warning'
                      }
                    >
                      {session.status}
                    </Badge>

                    {session.status === 'Upcoming' && (
                      <button
                        onClick={() => {
                          if (!canCheckIn) {
                            addToast('Function Disabled', 'Trainer or Admin sign-in required for session check-ins.', 'danger');
                            return;
                          }
                          handleCheckIn(session.id, session.clientName);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 ${
                          canCheckIn 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95' 
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-75'
                        }`}
                        title={canCheckIn ? 'Check-in Session' : 'Locked - Auth Required'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Check-in {!canCheckIn && '🔒'}
                      </button>
                    )}

                    {session.status === 'Completed' && (
                      <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Feed with Filter Pills & Interactive Post Note */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Live Team Stream
              </h3>

              {/* Activity Filter Pills */}
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value as any)}
                className="text-[11px] px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold border-none focus:outline-none"
              >
                <option value="all">All Events</option>
                <option value="session">Sessions</option>
                <option value="payment">Payments</option>
                <option value="subscription">Subscriptions</option>
                <option value="client">Clients</option>
              </select>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
              {filteredActivities.map((act) => (
                <div key={act.id} className="relative pl-8 text-xs">
                  <span className="absolute left-2 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-gray-900 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                  <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-bold text-gray-900 dark:text-white">{act.user}</span>{' '}
                    {act.action}{' '}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{act.target}</span>
                  </p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block font-mono">
                    {act.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Team Note Post Form */}
          <form onSubmit={handlePostQuickNote} className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
            <input
              type="text"
              value={quickActivityText}
              onChange={(e) => setQuickActivityText(e.target.value)}
              placeholder="Post team update or broadcast note..."
              className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              title="Post note"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Renewal Danger Callout */}
          {pendingRenewalClients.length > 0 && (
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                {pendingRenewalClients.length} Subscriptions Expiring
              </div>
              <p className="text-[11px] opacity-90 mb-1.5">
                Clients including {pendingRenewalClients[0].name} require immediate renewal reachout.
              </p>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline"
              >
                Review Subscriptions &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Interactive Payment Log Modal */}
      {isQuickLogPaymentOpen && (
        <Modal
          isOpen={isQuickLogPaymentOpen}
          onClose={() => setIsQuickLogPaymentOpen(false)}
          title="Quick Record Payment"
          subtitle="Log instant settlement via UPI, Card, or Wire"
          maxWidth="md"
        >
          <form onSubmit={handleQuickLogPayment} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Select Client</label>
              <select
                value={quickPaymentClient}
                onChange={(e) => setQuickPaymentClient(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:outline-none"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.id}) - {c.plan}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Amount (₹ INR)</label>
              <input
                type="number"
                value={quickPaymentAmount}
                onChange={(e) => setQuickPaymentAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
              <select
                value={quickPaymentMethod}
                onChange={(e) => setQuickPaymentMethod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:outline-none"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Credit Card">Credit / Debit Card</option>
                <option value="Cash">Cash Settlement</option>
                <option value="Bank Transfer">Bank Wire / NEFT</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              Record Settlement & Generate Receipt
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
