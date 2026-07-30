import type { Client, Session, PaymentRecord, Subscription, ActivityLog, NotificationItem, SystemStats } from '../types';

export const initialStats: SystemStats = {
  activeClients: 148,
  activeClientsGrowth: 12.5,
  monthlyRevenue: 1845000, // In INR ₹
  monthlyRevenueGrowth: 18.2,
  todaysSessions: 24,
  completedSessionsToday: 16,
  pendingPayments: 7,
  pendingAmount: 185000,
  expiringSubscriptions: 5,
  attendanceRatePct: 94.2
};

export const initialClients: Client[] = [
  {
    id: 'CLI-8091',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@gmail.com',
    phone: '+91 98201 45678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    joinDate: '2026-01-15',
    status: 'Active',
    plan: '6 Months',
    assignedTrainer: 'Aarav Sharma',
    healthScore: 92,
    heightCm: 178,
    currentWeightKg: 76.5,
    targetWeightKg: 72.0,
    bmi: 24.1,
    notes: 'Recovered from mild hamstring sprain. Focusing on strength training and core stability.',
    weightHistory: [
      { date: '2026-02-01', weightKg: 82.0, bodyFatPct: 22.1 },
      { date: '2026-03-01', weightKg: 80.5, bodyFatPct: 20.8 },
      { date: '2026-04-01', weightKg: 79.0, bodyFatPct: 19.5 },
      { date: '2026-05-01', weightKg: 78.2, bodyFatPct: 18.2 },
      { date: '2026-06-01', weightKg: 77.1, bodyFatPct: 17.4 },
      { date: '2026-07-01', weightKg: 76.5, bodyFatPct: 16.5 }
    ],
    attendanceHistory: Array.from({ length: 90 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (89 - i));
      const dateStr = d.toISOString().split('T')[0];
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      return {
        date: dateStr,
        count: isWeekend ? (Math.random() > 0.7 ? 1 : 0) : (Math.random() > 0.2 ? 1 : 0)
      };
    })
  },
  {
    id: 'CLI-8092',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@techventures.in',
    phone: '+91 98450 12345',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    joinDate: '2026-03-10',
    status: 'Active',
    plan: '3 Months',
    assignedTrainer: 'Kavya Patel',
    healthScore: 88,
    heightCm: 165,
    currentWeightKg: 58.2,
    targetWeightKg: 55.0,
    bmi: 21.4,
    notes: 'Postural correction and Pilates flow. Attends 7 AM morning sessions.',
    weightHistory: [
      { date: '2026-04-01', weightKg: 62.0, bodyFatPct: 25.0 },
      { date: '2026-05-01', weightKg: 60.8, bodyFatPct: 23.5 },
      { date: '2026-06-01', weightKg: 59.4, bodyFatPct: 22.1 },
      { date: '2026-07-01', weightKg: 58.2, bodyFatPct: 21.0 }
    ],
    attendanceHistory: Array.from({ length: 90 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (89 - i));
      const dateStr = d.toISOString().split('T')[0];
      return { date: dateStr, count: Math.random() > 0.3 ? 1 : 0 };
    })
  },
  {
    id: 'CLI-8093',
    name: 'Vikramaditya Verma',
    email: 'vikram.verma@apexcapital.in',
    phone: '+91 99100 87654',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    joinDate: '2026-05-01',
    status: 'Pending Renewal',
    plan: '1 Month',
    assignedTrainer: 'Aarav Sharma',
    healthScore: 74,
    heightCm: 175,
    currentWeightKg: 86.0,
    targetWeightKg: 78.0,
    bmi: 28.1,
    notes: 'Subscription expires in 3 days. Send renewal reminder with annual discount.',
    weightHistory: [
      { date: '2026-05-01', weightKg: 90.0, bodyFatPct: 28.5 },
      { date: '2026-06-01', weightKg: 88.2, bodyFatPct: 27.2 },
      { date: '2026-07-01', weightKg: 86.0, bodyFatPct: 26.0 }
    ],
    attendanceHistory: Array.from({ length: 90 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (89 - i));
      return { date: d.toISOString().split('T')[0], count: Math.random() > 0.4 ? 1 : 0 };
    })
  },
  {
    id: 'CLI-8094',
    name: 'Priya Sundaram',
    email: 'priya.sundaram@designstudio.in',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    joinDate: '2025-11-20',
    status: 'Active',
    plan: '6 Months',
    assignedTrainer: 'Kavya Patel',
    healthScore: 96,
    heightCm: 168,
    currentWeightKg: 60.0,
    targetWeightKg: 59.0,
    bmi: 21.3,
    notes: 'Half-marathon endurance protocol. VO2 max interval training.',
    weightHistory: [
      { date: '2026-01-01', weightKg: 63.5, bodyFatPct: 20.1 },
      { date: '2026-03-01', weightKg: 62.2, bodyFatPct: 19.2 },
      { date: '2026-05-01', weightKg: 61.0, bodyFatPct: 18.5 },
      { date: '2026-07-01', weightKg: 60.0, bodyFatPct: 18.0 }
    ],
    attendanceHistory: Array.from({ length: 90 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (89 - i));
      return { date: d.toISOString().split('T')[0], count: Math.random() > 0.15 ? 1 : 0 };
    })
  },
  {
    id: 'CLI-8095',
    name: 'Dr. Rajesh Kulkarni',
    email: 'dr.rajesh@healthline.in',
    phone: '+91 97654 32109',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    joinDate: '2026-06-12',
    status: 'Expired',
    plan: '1 Month',
    assignedTrainer: 'Arjun Nair',
    healthScore: 68,
    heightCm: 176,
    currentWeightKg: 91.2,
    targetWeightKg: 82.0,
    bmi: 29.4,
    notes: 'Physiotherapy rehab for lumbar L4-L5 disc herniation.',
    weightHistory: [
      { date: '2026-06-12', weightKg: 93.0, bodyFatPct: 30.0 },
      { date: '2026-07-12', weightKg: 91.2, bodyFatPct: 29.0 }
    ],
    attendanceHistory: Array.from({ length: 90 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (89 - i));
      return { date: d.toISOString().split('T')[0], count: Math.random() > 0.6 ? 1 : 0 };
    })
  },
  {
    id: 'CLI-8096',
    name: 'Neha Deshmukh',
    email: 'neha.deshmukh@biofit.in',
    phone: '+91 98333 22110',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
    joinDate: '2026-02-01',
    status: 'Active',
    plan: '3 Months',
    assignedTrainer: 'Arjun Nair',
    healthScore: 90,
    heightCm: 162,
    currentWeightKg: 56.0,
    targetWeightKg: 54.0,
    bmi: 21.3,
    notes: 'Yoga mobility and core strengthening. Excellent consistency.',
    weightHistory: [
      { date: '2026-02-01', weightKg: 59.0, bodyFatPct: 24.0 },
      { date: '2026-04-01', weightKg: 57.5, bodyFatPct: 22.5 },
      { date: '2026-06-01', weightKg: 56.0, bodyFatPct: 21.2 }
    ],
    attendanceHistory: Array.from({ length: 90 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (89 - i));
      return { date: d.toISOString().split('T')[0], count: Math.random() > 0.25 ? 1 : 0 };
    })
  }
];

export const initialSubscriptions: Subscription[] = [
  {
    id: 'SUB-401',
    clientId: 'CLI-8091',
    clientName: 'Rohan Mehta',
    planName: '6 Months',
    price: 36000, // ₹36,000
    startDate: '2026-02-01',
    endDate: '2026-08-01',
    totalDays: 181,
    remainingDays: 2,
    status: 'Pending Renewal',
    autoRenew: false
  },
  {
    id: 'SUB-402',
    clientId: 'CLI-8092',
    clientName: 'Ananya Iyer',
    planName: '3 Months',
    price: 19500, // ₹19,500
    startDate: '2026-06-01',
    endDate: '2026-09-01',
    totalDays: 92,
    remainingDays: 33,
    status: 'Active',
    autoRenew: true
  },
  {
    id: 'SUB-403',
    clientId: 'CLI-8093',
    clientName: 'Vikramaditya Verma',
    planName: '1 Month',
    price: 7500, // ₹7,500
    startDate: '2026-07-01',
    endDate: '2026-08-01',
    totalDays: 31,
    remainingDays: 2,
    status: 'Pending Renewal',
    autoRenew: false
  },
  {
    id: 'SUB-404',
    clientId: 'CLI-8094',
    clientName: 'Priya Sundaram',
    planName: '6 Months',
    price: 36000,
    startDate: '2026-05-15',
    endDate: '2026-11-15',
    totalDays: 184,
    remainingDays: 108,
    status: 'Active',
    autoRenew: true
  },
  {
    id: 'SUB-405',
    clientId: 'CLI-8095',
    clientName: 'Dr. Rajesh Kulkarni',
    planName: '1 Month',
    price: 9000,
    startDate: '2026-06-12',
    endDate: '2026-07-12',
    totalDays: 30,
    remainingDays: 0,
    status: 'Expired',
    autoRenew: false
  },
  {
    id: 'SUB-406',
    clientId: 'CLI-8096',
    clientName: 'Neha Deshmukh',
    planName: '3 Months',
    price: 19500,
    startDate: '2026-05-01',
    endDate: '2026-08-01',
    totalDays: 92,
    remainingDays: 2,
    status: 'Pending Renewal',
    autoRenew: true
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: 'PAY-1088',
    invoiceNo: 'INV-2026-088',
    clientId: 'CLI-8091',
    clientName: 'Rohan Mehta',
    planName: '6 Months Elite Pass',
    amount: 36000,
    paidAmount: 36000,
    dueAmount: 0,
    date: '2026-02-01',
    dueDate: '2026-02-01',
    method: 'UPI',
    status: 'Paid',
    installments: [
      { installmentNo: 1, amount: 18000, dueDate: '2026-02-01', paidDate: '2026-02-01', status: 'Paid' },
      { installmentNo: 2, amount: 18000, dueDate: '2026-05-01', paidDate: '2026-05-01', status: 'Paid' }
    ]
  },
  {
    id: 'PAY-1089',
    invoiceNo: 'INV-2026-089',
    clientId: 'CLI-8092',
    clientName: 'Ananya Iyer',
    planName: '3 Months Pro Fitness',
    amount: 19500,
    paidAmount: 19500,
    dueAmount: 0,
    date: '2026-06-01',
    dueDate: '2026-06-01',
    method: 'UPI',
    status: 'Paid'
  },
  {
    id: 'PAY-1090',
    invoiceNo: 'INV-2026-090',
    clientId: 'CLI-8093',
    clientName: 'Vikramaditya Verma',
    planName: '1 Month Custom Pass',
    amount: 7500,
    paidAmount: 4500,
    dueAmount: 3000,
    date: '2026-07-01',
    dueDate: '2026-07-15',
    method: 'UPI',
    status: 'Partial',
    installments: [
      { installmentNo: 1, amount: 4500, dueDate: '2026-07-01', paidDate: '2026-07-01', status: 'Paid' },
      { installmentNo: 2, amount: 3000, dueDate: '2026-07-15', status: 'Overdue' }
    ]
  },
  {
    id: 'PAY-1091',
    invoiceNo: 'INV-2026-091',
    clientId: 'CLI-8094',
    clientName: 'Priya Sundaram',
    planName: '6 Months Performance',
    amount: 36000,
    paidAmount: 36000,
    dueAmount: 0,
    date: '2026-05-15',
    dueDate: '2026-05-15',
    method: 'Bank Transfer',
    status: 'Paid'
  },
  {
    id: 'PAY-1092',
    invoiceNo: 'INV-2026-092',
    clientId: 'CLI-8095',
    clientName: 'Dr. Rajesh Kulkarni',
    planName: '1 Month Rehab Plan',
    amount: 9000,
    paidAmount: 0,
    dueAmount: 9000,
    date: '2026-07-12',
    dueDate: '2026-07-20',
    method: 'Credit Card',
    status: 'Overdue'
  }
];

export const initialSessions: Session[] = [
  {
    id: 'SES-501',
    clientId: 'CLI-8091',
    clientName: 'Rohan Mehta',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    trainerName: 'Aarav Sharma',
    serviceType: 'Personal Training',
    date: '2026-07-30',
    time: '08:00',
    durationMinutes: 60,
    status: 'Completed',
    moodRating: 5,
    caloriesBurned: 540,
    workoutSummary: 'Heavy Deadlifts 4x8 (130kg), Bulgarian Split Squats 3x10, Hanging Leg Raises.',
    trainerNotes: 'Rohan executed clean form with solid knee stability. Advised warm foam rolling.'
  },
  {
    id: 'SES-502',
    clientId: 'CLI-8092',
    clientName: 'Ananya Iyer',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    trainerName: 'Kavya Patel',
    serviceType: 'Pilates',
    date: '2026-07-30',
    time: '09:30',
    durationMinutes: 60,
    status: 'Completed',
    moodRating: 5,
    caloriesBurned: 310,
    workoutSummary: 'Reformer Pilates Flow, Spine Stretch Forward, Single Leg Stretch.',
    trainerNotes: 'Exceptional thoracic mobility progress. Posture alignment improved.'
  },
  {
    id: 'SES-503',
    clientId: 'CLI-8093',
    clientName: 'Vikramaditya Verma',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    trainerName: 'Aarav Sharma',
    serviceType: 'CrossFit',
    date: '2026-07-30',
    time: '11:00',
    durationMinutes: 45,
    status: 'In Progress',
    workoutSummary: 'MetCon WOD: 15-12-9 Dumbbell Thrusters & Kettlebell Swings.',
    trainerNotes: 'Monitoring heart rate spikes during intervals.'
  },
  {
    id: 'SES-504',
    clientId: 'CLI-8094',
    clientName: 'Priya Sundaram',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    trainerName: 'Kavya Patel',
    serviceType: 'Personal Training',
    date: '2026-07-30',
    time: '14:00',
    durationMinutes: 60,
    status: 'Upcoming',
    workoutSummary: 'Endurance Tempo Pacing & Core Conditioning.',
    trainerNotes: 'Focus on cadence and breathing rhythm.'
  },
  {
    id: 'SES-505',
    clientId: 'CLI-8095',
    clientName: 'Dr. Rajesh Kulkarni',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    trainerName: 'Arjun Nair',
    serviceType: 'Physiotherapy',
    date: '2026-07-30',
    time: '16:00',
    durationMinutes: 60,
    status: 'Upcoming',
    workoutSummary: 'Lumbar Traction & Glute Activation Protocol.'
  },
  {
    id: 'SES-506',
    clientId: 'CLI-8096',
    clientName: 'Neha Deshmukh',
    clientAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
    trainerName: 'Kavya Patel',
    serviceType: 'Yoga',
    date: '2026-07-30',
    time: '17:30',
    durationMinutes: 60,
    status: 'Upcoming',
    workoutSummary: 'Vinyasa Flow & Deep Hip Openers.'
  }
];

export const initialActivities: ActivityLog[] = [
  {
    id: 'ACT-901',
    timestamp: '10 mins ago',
    user: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    action: 'completed session for',
    target: 'Rohan Mehta',
    type: 'session'
  },
  {
    id: 'ACT-902',
    timestamp: '45 mins ago',
    user: 'Kavya Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    action: 'logged UPI payment of ₹19,500 from',
    target: 'Ananya Iyer',
    type: 'payment'
  },
  {
    id: 'ACT-903',
    timestamp: '2 hours ago',
    user: 'System Bot',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    action: 'flagged subscription renewal due for',
    target: 'Vikramaditya Verma',
    type: 'subscription'
  },
  {
    id: 'ACT-904',
    timestamp: '4 hours ago',
    user: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    action: 'onboarded new member',
    target: 'Neha Deshmukh',
    type: 'client'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'NOT-1',
    title: 'Subscription Expiry Alert',
    message: '3 client subscriptions are expiring in the next 48 hours.',
    time: '15m ago',
    read: false,
    type: 'warning'
  },
  {
    id: 'NOT-2',
    title: 'Installment Overdue',
    message: 'Vikramaditya Verma has an overdue installment of ₹3,000.',
    time: '2h ago',
    read: false,
    type: 'danger'
  },
  {
    id: 'NOT-3',
    title: 'New Member Onboarded',
    message: 'Neha Deshmukh joined 3 Months Pro Pilates plan.',
    time: '5h ago',
    read: true,
    type: 'success'
  }
];

export const revenueTrendData = [
  { month: 'Jan', revenue: 1240000, sessions: 280, clients: 110 },
  { month: 'Feb', revenue: 1380000, sessions: 310, clients: 122 },
  { month: 'Mar', revenue: 1490000, sessions: 340, clients: 130 },
  { month: 'Apr', revenue: 1620000, sessions: 380, clients: 138 },
  { month: 'May', revenue: 1710000, sessions: 410, clients: 142 },
  { month: 'Jun', revenue: 1800000, sessions: 435, clients: 145 },
  { month: 'Jul', revenue: 1845000, sessions: 460, clients: 148 }
];

export const attendanceDistributionData = [
  { day: 'Mon', completed: 38, missed: 2, cancelled: 1 },
  { day: 'Tue', completed: 42, missed: 1, cancelled: 3 },
  { day: 'Wed', completed: 45, missed: 3, cancelled: 0 },
  { day: 'Thu', completed: 40, missed: 2, cancelled: 2 },
  { day: 'Fri', completed: 48, missed: 1, cancelled: 1 },
  { day: 'Sat', completed: 32, missed: 4, cancelled: 2 },
  { day: 'Sun', completed: 18, missed: 1, cancelled: 0 }
];

export const planDistributionData = [
  { name: '1 Month', value: 25, color: '#3B82F6' },
  { name: '3 Months', value: 45, color: '#10B981' },
  { name: '6 Months', value: 20, color: '#8B5CF6' },
  { name: 'Custom', value: 10, color: '#F59E0B' }
];
