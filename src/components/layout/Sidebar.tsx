import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { NavTab } from '../../types';
import { 
  LayoutDashboard, Users, CreditCard, Calendar, Receipt, 
  BarChart3, Settings, ShieldCheck, ChevronLeft, ChevronRight, Activity, Zap
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, stats, clients, sessions, payments } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const pendingRenewalCount = clients.filter(c => c.status === 'Pending Renewal').length;
  const todaysSessionsCount = sessions.filter(s => s.date === '2026-07-30').length;
  const pendingPaymentsCount = payments.filter(p => p.status === 'Overdue' || p.status === 'Partial').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users, badge: clients.length },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, badge: pendingRenewalCount > 0 ? pendingRenewalCount : undefined },
    { id: 'sessions', label: 'Sessions', icon: Calendar, badge: todaysSessionsCount },
    { id: 'payments', label: 'Payments', icon: Receipt, badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'auth', label: 'Auth Gateway', icon: ShieldCheck }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-all duration-300 z-30 select-none relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Activity className="w-5 h-5 animate-pulse-subtle" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-white leading-none">
                Kinetic<span className="text-blue-600 dark:text-blue-400">OS</span>
              </span>
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">
                Session & Sub System
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Main Menu
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 relative group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
              
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Facility Footer Widget */}
      {!isCollapsed && (
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 dark:border-blue-500/30">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-gray-900 dark:text-white">Pro Plan Active</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
            Apex Performance Center (148 active members)
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${(stats.activeClients / 200) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 block text-right mt-1 font-mono">
            148 / 200 slots
          </span>
        </div>
      )}
    </aside>
  );
};
