export type NavTab = 
  | 'dashboard'
  | 'clients'
  | 'subscriptions'
  | 'sessions'
  | 'payments'
  | 'reports'
  | 'settings'
  | 'auth';

export type PlanType = '1 Month' | '3 Months' | '6 Months' | 'Custom';

export type ClientStatus = 'Active' | 'Pending Renewal' | 'Expired' | 'Inactive';

export type SessionStatus = 'Completed' | 'Missed' | 'Cancelled' | 'Upcoming' | 'In Progress';

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Cash' | 'Bank Transfer';

export type PaymentStatus = 'Paid' | 'Partial' | 'Overdue' | 'Pending';

export type UserRole = 'Super Admin' | 'Center Manager' | 'Head Trainer' | 'Staff Analyst';

export interface UserSession {
  id: string;
  deviceName: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
  browser: string;
}

export interface SecurityAuditLog {
  id: string;
  event: string;
  timestamp: string;
  ip: string;
  status: 'Success' | 'Warning' | 'Blocked';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  phone: string;
  twoFactorEnabled: boolean;
  passkeyRegistered: boolean;
}

export interface Subscription {
  id: string;
  clientId: string;
  clientName: string;
  planName: PlanType;
  price: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  remainingDays: number;
  status: ClientStatus;
  autoRenew: boolean;
}

export interface PaymentRecord {
  id: string;
  invoiceNo: string;
  clientId: string;
  clientName: string;
  planName: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  date: string;
  dueDate: string;
  method: PaymentMethod;
  status: PaymentStatus;
  installments?: {
    installmentNo: number;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: PaymentStatus;
  }[];
}

export interface Session {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  trainerName: string;
  serviceType: 'Personal Training' | 'Physiotherapy' | 'Pilates' | 'CrossFit' | 'Yoga' | 'Spinning';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  status: SessionStatus;
  moodRating?: number; // 1-5
  caloriesBurned?: number;
  workoutSummary?: string;
  trainerNotes?: string;
}

export interface WeightRecord {
  date: string;
  weightKg: number;
  bodyFatPct?: number;
  muscleMassKg?: number;
}

export interface AttendanceDay {
  date: string; // YYYY-MM-DD
  count: number; // 0, 1, 2+
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  status: ClientStatus;
  plan: PlanType;
  assignedTrainer: string;
  healthScore: number; // 0-100
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  bmi: number;
  notes: string;
  weightHistory: WeightRecord[];
  attendanceHistory: AttendanceDay[];
  currentSubscription?: Subscription;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  type: 'session' | 'payment' | 'subscription' | 'client';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'warning' | 'info' | 'success' | 'danger';
}

export interface SystemStats {
  activeClients: number;
  activeClientsGrowth: number;
  monthlyRevenue: number;
  monthlyRevenueGrowth: number;
  todaysSessions: number;
  completedSessionsToday: number;
  pendingPayments: number;
  pendingAmount: number;
  expiringSubscriptions: number;
  attendanceRatePct: number;
}
