import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { NavTab } from '../../types';
import { 
  LayoutDashboard, Users, CreditCard, Calendar, Receipt, 
  Menu, X, BarChart3, Settings, ShieldCheck, Activity, UserPlus, PlusCircle
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsAddClientOpen, 
    setIsAddPaymentOpen
  } = useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const mainTabs: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: Receipt },
  ];

  const drawerTabs: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'auth', label: 'Auth Gateway', icon: ShieldCheck }
  ];

  return (
    <>
      {/* Bottom Sticky Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-2 z-40">
        {mainTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-semibold transition-all ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              <span>{t.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-xs">
          <div className="flex-1" onClick={() => setIsDrawerOpen(false)} />
          <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 rounded-t-3xl p-6 shadow-2xl space-y-6 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">KineticOS</h3>
                  <p className="text-xs text-gray-500">Navigation Menu</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Mobile Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setIsAddClientOpen(true);
                  setIsDrawerOpen(false);
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20"
              >
                <UserPlus className="w-4 h-4" />
                Add Member
              </button>
              <button
                onClick={() => {
                  setIsAddPaymentOpen(true);
                  setIsDrawerOpen(false);
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                <PlusCircle className="w-4 h-4" />
                Log Payment
              </button>
            </div>

            {/* Nav list in drawer */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                All Modules
              </div>
              {[...mainTabs, ...drawerTabs].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(t.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
