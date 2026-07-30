import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, Users, CreditCard, Calendar, Receipt, BarChart3, 
  Settings, UserPlus, PlusCircle, ArrowRight, X 
} from 'lucide-react';
import type { NavTab } from '../../types';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setActiveTab, 
    clients, 
    setSelectedClient,
    setIsAddClientOpen,
    setIsAddPaymentOpen
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const navigateTo = (tab: NavTab) => {
    setActiveTab(tab);
    setIsCommandPaletteOpen(false);
  };

  const navCommands = [
    { label: 'Go to Dashboard', tab: 'dashboard' as NavTab, icon: Calendar },
    { label: 'Go to Clients Directory', tab: 'clients' as NavTab, icon: Users },
    { label: 'Go to Subscriptions', tab: 'subscriptions' as NavTab, icon: CreditCard },
    { label: 'Go to Session Calendar', tab: 'sessions' as NavTab, icon: Calendar },
    { label: 'Go to Payments & Ledger', tab: 'payments' as NavTab, icon: Receipt },
    { label: 'Go to Reports & Analytics', tab: 'reports' as NavTab, icon: BarChart3 },
    { label: 'Go to Settings', tab: 'settings' as NavTab, icon: Settings },
  ].filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  const filteredClients = clients.filter(
    c => c.name.toLowerCase().includes(query.toLowerCase()) || 
         c.email.toLowerCase().includes(query.toLowerCase()) ||
         c.id.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsCommandPaletteOpen(false)} 
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar */}
        <div className="flex items-center px-4 border-b border-gray-100 dark:border-gray-800">
          <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search client name, ID, email..."
            className="w-full py-4 text-sm font-medium bg-transparent text-gray-900 dark:text-white focus:outline-none placeholder-gray-400"
          />
          <button 
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 mb-1.5">
              Quick Actions
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setIsAddClientOpen(true);
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-semibold text-gray-800 dark:text-gray-200 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Onboard New Member</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setIsAddPaymentOpen(true);
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-xs font-semibold text-gray-800 dark:text-gray-200 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Record New Payment</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Client Search Hits */}
          {filteredClients.length > 0 && (
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 mb-1.5">
                Client Directory
              </div>
              <div className="space-y-1">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={client.avatar} 
                        alt={client.name} 
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold text-gray-900 dark:text-white">
                          {client.name}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {client.id} • {client.plan}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      Open Profile
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Commands */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 mb-1.5">
              Navigation Commands
            </div>
            <div className="space-y-1">
              {navCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.tab}
                    onClick={() => navigateTo(cmd.tab)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span>{cmd.label}</span>
                    </div>
                    <kbd className="text-[10px] text-gray-400 font-mono">Jump</kbd>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between text-[11px] text-gray-400">
          <span>Use ↑ ↓ to navigate, enter to select</span>
          <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">ESC to close</kbd>
        </div>
      </div>
    </div>
  );
};
