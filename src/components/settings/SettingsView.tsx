import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, Users, Bell, Save 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { addToast, hasPermission, isAuthenticated, signIn } = useApp();
  const [centerName, setCenterName] = useState('Apex Fitness & Wellness Center - Mumbai');
  const [currency, setCurrency] = useState('INR (₹)');
  const [autoSmsReminders, setAutoSmsReminders] = useState(true);
  const [autoEmailInvoices, setAutoEmailInvoices] = useState(true);

  const canManageSettings = hasPermission('manage_settings');

  const handleSave = () => {
    if (!canManageSettings) {
      addToast('Function Disabled', 'Super Admin authentication required to update system settings.', 'danger');
      return;
    }
    addToast('Settings Saved', 'System preferences updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          System Settings & Control Panel
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Configure facility details, staff roles, payment gateways, and automated reminders
        </p>
      </div>

      {!canManageSettings && (
        <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div>
            <div className="font-extrabold text-sm flex items-center gap-2">
              <span>🔒 Protected Function - Super Admin Access Required</span>
            </div>
            <p className="text-xs opacity-90 mt-1">
              {!isAuthenticated 
                ? 'You are currently signed out. Sign in as Super Admin to edit facility configurations, currency standards, and staff roles.' 
                : 'Your current role does not have elevated privileges for system settings.'}
            </p>
          </div>
          <button
            onClick={signIn}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm whitespace-nowrap self-start sm:self-center"
          >
            Authenticate as Super Admin
          </button>
        </div>
      )}

      {/* Center Profile */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" /> Facility Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Center Name</label>
            <input
              type="text"
              value={centerName}
              onChange={(e) => setCenterName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Operating Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium focus:outline-none"
            >
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
              <option value="INR (₹)">INR (₹)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff & Roles */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" /> Head Trainers & Staff Access
        </h3>

        <div className="space-y-3">
          {[
            { name: 'Aarav Sharma', role: 'Head Admin & Senior Trainer', email: 'aarav.sharma@kinetic.os.in', status: 'Full Access' },
            { name: 'Kavya Patel', role: 'Pilates & Yoga Lead Specialist', email: 'kavya.patel@kinetic.os.in', status: 'Trainer Access' },
            { name: 'Arjun Nair', role: 'Lead Physiotherapist', email: 'arjun.nair@kinetic.os.in', status: 'Clinical Access' }
          ].map((staff) => (
            <div key={staff.email} className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div>
                <div className="font-bold text-xs text-gray-900 dark:text-white">{staff.name}</div>
                <div className="text-[11px] text-gray-500">{staff.role} • {staff.email}</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold">
                {staff.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Automation */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" /> Automated Communication Triggers
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 cursor-pointer">
            <div>
              <span className="font-bold text-gray-900 dark:text-white">Automated SMS & WhatsApp Payment Reminders</span>
              <p className="text-gray-500">Send reminder 3 days before subscription expiration</p>
            </div>
            <input
              type="checkbox"
              checked={autoSmsReminders}
              onChange={(e) => setAutoSmsReminders(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 cursor-pointer">
            <div>
              <span className="font-bold text-gray-900 dark:text-white">Auto-generate PDF Receipt on Payment Log</span>
              <p className="text-gray-500">Instantly email printable PDF invoice to member email</p>
            </div>
            <input
              type="checkbox"
              checked={autoEmailInvoices}
              onChange={(e) => setAutoEmailInvoices(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2"
      >
        <Save className="w-4 h-4" /> Save System Preferences
      </button>
    </div>
  );
};
