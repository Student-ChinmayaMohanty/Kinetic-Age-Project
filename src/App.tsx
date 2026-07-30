import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToastContainer } from './components/layout/ToastContainer';
import { ClientProfileModal } from './components/clients/ClientProfileModal';
import { AddClientModal } from './components/clients/AddClientModal';

import { DashboardView } from './components/dashboard/DashboardView';
import { ClientListView } from './components/clients/ClientListView';
import { SubscriptionsView } from './components/subscriptions/SubscriptionsView';
import { SessionsView } from './components/sessions/SessionsView';
import { PaymentsView } from './components/payments/PaymentsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthView } from './components/auth/AuthView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'clients' && <ClientListView />}
      {activeTab === 'subscriptions' && <SubscriptionsView />}
      {activeTab === 'sessions' && <SessionsView />}
      {activeTab === 'payments' && <PaymentsView />}
      {activeTab === 'reports' && <ReportsView />}
      {activeTab === 'settings' && <SettingsView />}
      {activeTab === 'auth' && <AuthView />}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex bg-[#FAFAFA] dark:bg-[#0B0F17] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200 antialiased selection:bg-blue-500 selection:text-white">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar />

        {/* Main Application Frame */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <Navbar />
          <MainContent />
        </div>

        {/* Floating Controls & Modals */}
        <MobileNav />
        <CommandPalette />
        <ToastContainer />
        <ClientProfileModal />
        <AddClientModal />
      </div>
    </AppProvider>
  );
}

export default App;
