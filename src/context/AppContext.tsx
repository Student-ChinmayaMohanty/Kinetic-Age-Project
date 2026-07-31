import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  NavTab, Client, Session, PaymentRecord, Subscription, 
  ActivityLog, NotificationItem, SystemStats, UserProfile, UserRole, UserSession, SecurityAuditLog
} from '../types';
import { 
  initialClients, initialSessions, initialPayments, 
  initialSubscriptions, initialActivities, initialNotifications, initialStats 
} from '../mock/data';
import confetti from 'canvas-confetti';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

export type PermissionKey = 
  | 'onboard_client' 
  | 'log_payment' 
  | 'renew_subscription' 
  | 'checkin_session' 
  | 'export_csv' 
  | 'manage_settings' 
  | 'view_financials';

interface AppContextType {
  // Navigation & Theme
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSkeletonLoading: boolean;
  toggleSkeletonLoading: () => void;

  // Search & Command Palette
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Authentication State & User Profile
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
  hasPermission: (key: PermissionKey) => boolean;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  switchRole: (role: UserRole) => void;
  userSessions: UserSession[];
  revokeSession: (id: string) => void;
  revokeAllOtherSessions: () => void;
  securityLogs: SecurityAuditLog[];
  toggleTwoFactor: () => void;

  // Data Collections
  stats: SystemStats;
  clients: Client[];
  sessions: Session[];
  payments: PaymentRecord[];
  subscriptions: Subscription[];
  activities: ActivityLog[];
  notifications: NotificationItem[];
  
  // Selection & Modals State
  selectedClient: Client | null;
  setSelectedClient: (c: Client | null) => void;
  isAddClientOpen: boolean;
  setIsAddClientOpen: (open: boolean) => void;
  isAddPaymentOpen: boolean;
  setIsAddPaymentOpen: (open: boolean) => void;
  selectedInvoice: PaymentRecord | null;
  setSelectedInvoice: (p: PaymentRecord | null) => void;

  // Actions
  addClient: (c: Partial<Client>) => void;
  updateClient: (clientId: string, updates: Partial<Client>) => void;
  updateSessionStatus: (id: string, status: Session['status'], notes?: string, caloriesBurned?: number) => void;
  recordPayment: (payment: Partial<PaymentRecord>) => void;
  renewSubscription: (subId: string) => void;
  resetDataToDefaults: () => void;
  addToast: (title: string, message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  toasts: Toast[];
  markNotificationRead: (id: string) => void;
}

const initialUserProfile: UserProfile = {
  id: 'USR-101',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@apex.in',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  role: 'Super Admin',
  phone: '+91 98201 99887',
  twoFactorEnabled: true,
  passkeyRegistered: true
};

const initialUserSessions: UserSession[] = [
  {
    id: 'SES-01',
    deviceName: 'MacBook Pro 16" (M3 Max)',
    location: 'Mumbai, MH, India',
    ipAddress: '103.21.244.12',
    lastActive: 'Active now',
    isCurrent: true,
    browser: 'Chrome 126.0'
  },
  {
    id: 'SES-02',
    deviceName: 'iPhone 15 Pro Max',
    location: 'Mumbai, MH, India',
    ipAddress: '49.36.12.89',
    lastActive: '25 mins ago',
    isCurrent: false,
    browser: 'KineticOS Mobile v2.4'
  },
  {
    id: 'SES-03',
    deviceName: 'iPad Pro 12.9"',
    location: 'Bengaluru, KA, India',
    ipAddress: '182.73.91.44',
    lastActive: 'Yesterday at 18:40',
    isCurrent: false,
    browser: 'Safari 17.4'
  }
];

const initialSecurityLogs: SecurityAuditLog[] = [
  { id: 'SEC-101', event: 'WebAuthn Passkey Authentication', timestamp: 'Today, 08:30 AM', ip: '103.21.244.12', status: 'Success' },
  { id: 'SEC-102', event: '2FA OTP Verification Code Sent', timestamp: 'Today, 08:29 AM', ip: '103.21.244.12', status: 'Success' },
  { id: 'SEC-103', event: 'Password Changed Successfully', timestamp: 'July 28, 2026', ip: '103.21.244.12', status: 'Success' },
  { id: 'SEC-104', event: 'Unrecognized Device Login Attempt', timestamp: 'July 25, 2026', ip: '185.220.101.5', status: 'Blocked' }
];

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from localStorage`, e);
    return fallback;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => getStored('kinetic_user', initialUserProfile));
  const [userSessions, setUserSessions] = useState<UserSession[]>(initialUserSessions);
  const [securityLogs] = useState<SecurityAuditLog[]>(initialSecurityLogs);

  const [stats, setStats] = useState<SystemStats>(() => getStored('kinetic_stats', initialStats));
  const [clients, setClients] = useState<Client[]>(() => getStored('kinetic_clients', initialClients));
  const [sessions, setSessions] = useState<Session[]>(() => getStored('kinetic_sessions', initialSessions));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => getStored('kinetic_payments', initialPayments));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => getStored('kinetic_subscriptions', initialSubscriptions));
  const [activities, setActivities] = useState<ActivityLog[]>(() => getStored('kinetic_activities', initialActivities));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getStored('kinetic_notifications', initialNotifications));

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('kinetic_stats', JSON.stringify(stats)); }, [stats]);
  useEffect(() => { localStorage.setItem('kinetic_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('kinetic_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('kinetic_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('kinetic_subscriptions', JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem('kinetic_activities', JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem('kinetic_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('kinetic_user', JSON.stringify(currentUser)); }, [currentUser]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState<boolean>(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentRecord | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Granular Permission Engine
  const hasPermission = (key: PermissionKey): boolean => {
    // If not authenticated, ALL write/admin actions are completely disabled!
    if (!isAuthenticated) return false;

    const role = currentUser.role;
    switch (key) {
      case 'onboard_client':
        return role === 'Super Admin' || role === 'Center Manager';
      case 'log_payment':
      case 'renew_subscription':
      case 'view_financials':
        return role === 'Super Admin' || role === 'Center Manager';
      case 'checkin_session':
        return role === 'Super Admin' || role === 'Center Manager' || role === 'Head Trainer';
      case 'export_csv':
        return role === 'Super Admin' || role === 'Center Manager' || role === 'Staff Analyst';
      case 'manage_settings':
        return role === 'Super Admin';
      default:
        return false;
    }
  };

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleSkeletonLoading = () => {
    setIsSkeletonLoading(true);
    setTimeout(() => setIsSkeletonLoading(false), 1200);
  };

  const addToast = (title: string, message: string, type: Toast['type'] = 'info') => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const signIn = () => {
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    addToast('Signed In', `Welcome back, ${currentUser.name} (${currentUser.role}). All features enabled.`, 'success');
    confetti({ particleCount: 60, spread: 60 });
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setActiveTab('auth');
    addToast('Signed Out', 'You have been signed out. Protected functions have been disabled.', 'warning');
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser(prev => ({ ...prev, role }));
    addToast('Role Switched', `Simulating permissions for ${role}.`, 'info');
  };

  const revokeSession = (id: string) => {
    setUserSessions(prev => prev.filter(s => s.id !== id));
    addToast('Session Revoked', 'Terminated remote session successfully.', 'warning');
  };

  const revokeAllOtherSessions = () => {
    setUserSessions(prev => prev.filter(s => s.isCurrent));
    addToast('All Sessions Terminated', 'Logged out all other devices.', 'success');
  };

  const toggleTwoFactor = () => {
    setCurrentUser(prev => {
      const nextState = !prev.twoFactorEnabled;
      addToast(
        nextState ? '2FA Enabled' : '2FA Disabled',
        nextState ? 'Two-Factor Authentication is now active.' : 'Security level reduced.',
        nextState ? 'success' : 'warning'
      );
      return { ...prev, twoFactorEnabled: nextState };
    });
  };

  const addClient = (c: Partial<Client>) => {
    if (!hasPermission('onboard_client')) {
      addToast('Access Denied', 'Authentication & Super Admin / Manager role required to onboard members.', 'danger');
      return;
    }

    const newId = `CLI-${Math.floor(8000 + Math.random() * 1000)}`;
    const newClient: Client = {
      id: newId,
      name: c.name || 'New Member',
      email: c.email || 'member@kinetic.os',
      phone: c.phone || '+91 98000 00000',
      avatar: c.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      plan: c.plan || '3 Months',
      assignedTrainer: c.assignedTrainer || 'Aarav Sharma',
      healthScore: 85,
      heightCm: c.heightCm || 175,
      currentWeightKg: c.currentWeightKg || 70,
      targetWeightKg: c.targetWeightKg || 65,
      bmi: Number((((c.currentWeightKg || 70) / ((c.heightCm || 175) / 100)) / ((c.heightCm || 175) / 100)).toFixed(1)),
      notes: c.notes || 'Newly onboarded fitness client.',
      weightHistory: [
        { date: new Date().toISOString().split('T')[0], weightKg: c.currentWeightKg || 70 }
      ],
      attendanceHistory: Array.from({ length: 90 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (89 - i));
        return { date: d.toISOString().split('T')[0], count: Math.random() > 0.5 ? 1 : 0 };
      })
    };

    setClients((prev) => [newClient, ...prev]);
    setStats((prev) => ({ ...prev, activeClients: prev.activeClients + 1 }));

    // Add subscription
    const newSub: Subscription = {
      id: `SUB-${Math.floor(400 + Math.random() * 500)}`,
      clientId: newId,
      clientName: newClient.name,
      planName: newClient.plan,
      price: newClient.plan === '1 Month' ? 7500 : newClient.plan === '3 Months' ? 19500 : 36000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      totalDays: 90,
      remainingDays: 90,
      status: 'Active',
      autoRenew: true
    };
    setSubscriptions((prev) => [newSub, ...prev]);

    // Log Activity
    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        timestamp: 'Just now',
        user: currentUser.name,
        avatar: newClient.avatar,
        action: 'onboarded new member',
        target: newClient.name,
        type: 'client'
      },
      ...prev
    ]);

    addToast('Client Onboarded!', `${newClient.name} joined as ${newClient.plan} member.`, 'success');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  const updateSessionStatus = (id: string, status: Session['status'], notes?: string, caloriesBurned?: number) => {
    if (!hasPermission('checkin_session')) {
      addToast('Access Denied', 'Authentication & Trainer / Admin role required for session check-ins.', 'danger');
      return;
    }

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, status };
          if (notes !== undefined) updated.trainerNotes = notes;
          if (caloriesBurned !== undefined) updated.caloriesBurned = caloriesBurned;
          return updated;
        }
        return s;
      })
    );
    addToast('Session Updated', `Session status changed to ${status}.`, 'info');
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...updates } : c))
    );
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const resetDataToDefaults = () => {
    localStorage.removeItem('kinetic_stats');
    localStorage.removeItem('kinetic_clients');
    localStorage.removeItem('kinetic_sessions');
    localStorage.removeItem('kinetic_payments');
    localStorage.removeItem('kinetic_subscriptions');
    localStorage.removeItem('kinetic_activities');
    localStorage.removeItem('kinetic_notifications');
    localStorage.removeItem('kinetic_user');
    setStats(initialStats);
    setClients(initialClients);
    setSessions(initialSessions);
    setPayments(initialPayments);
    setSubscriptions(initialSubscriptions);
    setActivities(initialActivities);
    setNotifications(initialNotifications);
    setCurrentUser(initialUserProfile);
    addToast('Data Reset', 'All data restored to default initial values.', 'info');
  };

  const recordPayment = (p: Partial<PaymentRecord>) => {
    if (!hasPermission('log_payment')) {
      addToast('Access Denied', 'Authentication & Financial Admin role required to record payments.', 'danger');
      return;
    }

    const newPay: PaymentRecord = {
      id: `PAY-${Math.floor(1100 + Math.random() * 100)}`,
      invoiceNo: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientId: p.clientId || 'CLI-8091',
      clientName: p.clientName || 'Rohan Mehta',
      planName: p.planName || 'Pro Fitness Pass',
      amount: p.amount || 19500,
      paidAmount: p.paidAmount || p.amount || 19500,
      dueAmount: Math.max(0, (p.amount || 19500) - (p.paidAmount || p.amount || 19500)),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      method: p.method || 'UPI',
      status: (p.paidAmount || 0) >= (p.amount || 1) ? 'Paid' : 'Partial'
    };

    setPayments((prev) => [newPay, ...prev]);
    setStats((prev) => ({
      ...prev,
      monthlyRevenue: prev.monthlyRevenue + newPay.paidAmount
    }));

    addToast('Payment Recorded', `Recorded ₹${newPay.paidAmount.toLocaleString('en-IN')} via ${newPay.method}.`, 'success');
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
  };

  const renewSubscription = (subId: string) => {
    if (!hasPermission('renew_subscription')) {
      addToast('Access Denied', 'Authentication & Admin role required to renew subscriptions.', 'danger');
      return;
    }

    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subId) {
          return {
            ...sub,
            remainingDays: sub.totalDays,
            status: 'Active'
          };
        }
        return sub;
      })
    );
    addToast('Subscription Renewed', 'Subscription extended by plan period.', 'success');
    confetti({ particleCount: 70, spread: 70 });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isDarkMode,
        toggleDarkMode,
        isSkeletonLoading,
        toggleSkeletonLoading,
        globalSearch,
        setGlobalSearch,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAuthenticated,
        signIn,
        signOut,
        hasPermission,
        currentUser,
        setCurrentUser,
        switchRole,
        userSessions,
        revokeSession,
        revokeAllOtherSessions,
        securityLogs,
        toggleTwoFactor,
        stats,
        clients,
        sessions,
        payments,
        subscriptions,
        activities,
        notifications,
        selectedClient,
        setSelectedClient,
        isAddClientOpen,
        setIsAddClientOpen,
        isAddPaymentOpen,
        setIsAddPaymentOpen,
        selectedInvoice,
        setSelectedInvoice,
        addClient,
        updateClient,
        updateSessionStatus,
        recordPayment,
        renewSubscription,
        resetDataToDefaults,
        addToast,
        removeToast,
        toasts,
        markNotificationRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
