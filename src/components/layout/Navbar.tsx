import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, Bell, Sun, Moon, Command, UserPlus, PlusCircle, 
  CheckCircle2, AlertTriangle, Building2, ChevronDown, RefreshCw, Shield, LogOut, LogIn
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    toggleSkeletonLoading, 
    isSkeletonLoading,
    setIsCommandPaletteOpen, 
    setIsAddClientOpen, 
    setIsAddPaymentOpen,
    notifications,
    markNotificationRead,
    activeTab,
    isAuthenticated,
    signIn,
    signOut,
    currentUser
  } = useApp();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Analytics Dashboard';
      case 'clients': return 'Client Directory';
      case 'subscriptions': return 'Subscription Management';
      case 'sessions': return 'Session Tracking';
      case 'payments': return 'Payments & Revenue';
      case 'reports': return 'Reports & Analytics';
      case 'settings': return 'System Settings';
      case 'auth': return 'Authentication Portal';
      default: return 'KineticOS';
    }
  };

  const handleSignOutClick = () => {
    setIsProfileMenuOpen(false);
    signOut();
  };

  return (
    <header className="h-16 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Facility Select */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            Real-time Session & Subscription Intelligence
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-800">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Apex Fitness Center - Mumbai
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Launcher */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-gray-700 transition-colors text-xs font-medium border border-transparent dark:border-gray-700/50"
        >
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <span className="hidden sm:inline">Search or command...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[10px] font-mono text-gray-400 shadow-2xs">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Quick Add Actions */}
        {isAuthenticated && (
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setIsAddClientOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs shadow-blue-600/20 active:scale-95 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Member
            </button>

            <button
              onClick={() => setIsAddPaymentOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Log Payment
            </button>
          </div>
        )}

        {/* Skeleton Simulation Toggle */}
        <button
          onClick={toggleSkeletonLoading}
          className={`p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative ${
            isSkeletonLoading ? 'animate-spin text-blue-600' : ''
          }`}
          title="Simulate Skeleton Loading State"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notification Bell Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900 animate-pulse" />
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 dark:text-white">Notifications</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  {unreadNotifications.length} unread
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3 text-xs flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${
                      !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="mt-0.5">
                      {n.type === 'danger' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                      {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{n.title}</div>
                      <div className="text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
        </button>

        {/* User Profile or Sign In Button */}
        {isAuthenticated ? (
          <div className="relative pl-1">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 rounded-full ring-2 ring-transparent hover:ring-blue-500 transition-all p-0.5"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{currentUser.role}</p>
                </div>
                <button 
                  onClick={() => setIsProfileMenuOpen(false)} 
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Account Security & 2FA
                </button>
                <button 
                  onClick={handleSignOutClick} 
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={signIn}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
