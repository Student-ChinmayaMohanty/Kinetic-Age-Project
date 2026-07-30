# 🏗️ Database Schema & Architectural Decisions — KineticOS

This document outlines the **Relational Database Schema (Prisma ORM / MySQL)** and the **Core Software Architectural Decisions** behind KineticOS.

---

## 💾 Relational Database Schema (Prisma ERD / SQL DDL)

KineticOS uses a normalized relational data model designed for high transaction velocity across client memberships, multi-installment payments, daily session appointments, and security logs.

```prisma
// datasource db {
//   provider = "mysql"
//   url      = env("DATABASE_URL")
// }

enum UserRole {
  SUPER_ADMIN
  CENTER_MANAGER
  HEAD_TRAINER
  STAFF_ANALYST
}

enum ClientStatus {
  ACTIVE
  PENDING_RENEWAL
  EXPIRED
  INACTIVE
}

enum SessionStatus {
  UPCOMING
  IN_PROGRESS
  COMPLETED
  MISSED
  CANCELLED
}

enum PaymentMethod {
  UPI
  CREDIT_CARD
  CASH
  BANK_TRANSFER
}

enum PaymentStatus {
  PAID
  PARTIAL
  OVERDUE
  PENDING
}

model User {
  id                String            @id @default(uuid())
  name              String
  email             String            @unique
  phone             String
  avatar            String?
  role              UserRole          @default(HEAD_TRAINER)
  twoFactorEnabled  Boolean           @default(true)
  passkeyRegistered Boolean           @default(false)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  sessions          AccountSession[]
  auditLogs         SecurityAuditLog[]
  clientAssignments Client[]          @relation("TrainerAssignments")
  sessionTrainer    SessionAppointment[]
}

model AccountSession {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  deviceName String
  location   String
  ipAddress  String
  browser    String
  isCurrent  Boolean  @default(false)
  lastActive DateTime @default(now())
}

model SecurityAuditLog {
  id        String   @id @default(uuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  event     String
  ip        String
  status    String   // Success | Blocked | Warning
  timestamp DateTime @default(now())
}

model Client {
  id              String         @id @default(uuid())
  name            String
  email           String         @unique
  phone           String
  avatar          String?
  joinDate        DateTime       @default(now())
  status          ClientStatus   @default(ACTIVE)
  plan            String         // 1 Month | 3 Months | 6 Months | Custom
  healthScore     Int            @default(85)
  heightCm        Float
  currentWeightKg Float
  targetWeightKg  Float
  bmi             Float
  notes           String?        @db.Text
  
  assignedTrainerId String?
  assignedTrainer   User?        @relation("TrainerAssignments", fields: [assignedTrainerId], references: [id])
  
  weightHistory   WeightRecord[]
  attendanceDays  AttendanceDay[]
  subscriptions   Subscription[]
  payments        PaymentInvoice[]
  appointments    SessionAppointment[]
}

model WeightRecord {
  id          String   @id @default(uuid())
  clientId    String
  client      Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)
  date        DateTime @default(now())
  weightKg    Float
  bodyFatPct  Float?
  muscleMassKg Float?
}

model AttendanceDay {
  id       String   @id @default(uuid())
  clientId String
  client   Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)
  date     String   // YYYY-MM-DD
  count    Int      @default(1)
}

model Subscription {
  id            String       @id @default(uuid())
  clientId      String
  client        Client       @relation(fields: [clientId], references: [id], onDelete: Cascade)
  planName      String
  price         Float
  startDate     DateTime
  endDate       DateTime
  totalDays     Int
  remainingDays Int
  status        ClientStatus @default(ACTIVE)
  autoRenew     Boolean      @default(true)
}

model PaymentInvoice {
  id          String               @id @default(uuid())
  invoiceNo   String               @unique
  clientId    String
  client      Client               @relation(fields: [clientId], references: [id])
  planName    String
  amount      Float
  paidAmount  Float
  dueAmount   Float
  date        DateTime             @default(now())
  dueDate     DateTime
  method      PaymentMethod        @default(UPI)
  status      PaymentStatus        @default(PAID)
  
  installments PaymentInstallment[]
}

model PaymentInstallment {
  id            String         @id @default(uuid())
  invoiceId     String
  invoice       PaymentInvoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  installmentNo Int
  amount        Float
  dueDate       DateTime
  paidDate      DateTime?
  status        PaymentStatus  @default(PENDING)
}

model SessionAppointment {
  id              String        @id @default(uuid())
  clientId        String
  client          Client        @relation(fields: [clientId], references: [id], onDelete: Cascade)
  trainerId       String
  trainer         User          @relation(fields: [trainerId], references: [id])
  serviceType     String        // Personal Training | Pilates | Physiotherapy | Yoga | CrossFit
  date            String        // YYYY-MM-DD
  time            String        // HH:mm
  durationMinutes Int           @default(60)
  status          SessionStatus @default(UPCOMING)
  moodRating      Int?          // 1-5 stars
  caloriesBurned  Int?
  workoutSummary  String?       @db.Text
  trainerNotes    String?       @db.Text
}
```

---

## 🏛️ Architectural Decisions

### 1. Unified State Context (`AppContext`) with Granular RBAC Engine
- **Decision**: Built an in-memory application context with a reactive `hasPermission(permissionKey)` permission evaluator instead of scattered state hooks.
- **Rationale**: Guarantees strict authorization enforcement. When a user signs out or switches roles (e.g. `Staff Analyst`), all protected actions (`onboard_client`, `log_payment`, `renew_subscription`, `checkin_session`, `manage_settings`) instantly lock with visual lock indicators (`🔒`) and display feedback toasts.

### 2. Client-Side Data Processing & Real-Time Filters
- **Decision**: Implemented client-side filtering, sorting, pagination, and multi-select in React state.
- **Rationale**: Eliminates latency and server roundtrips, allowing sub-10ms instant response when switching time ranges (`7d`, `30d`, `90d`, `ytd`), filtering plans, or searching client records in the Command Palette.

### 3. Progressive Web Architecture (Desktop First, Mobile Adaptive)
- **Decision**: Designed desktop-first layout with collapsible left sidebar, header navbar, and command palette (`Cmd + K`), while providing a bottom navigation bar and slide-over drawer on mobile devices.
- **Rationale**: Center administrators primarily use desktop monitors to manage daily billing and reports, while personal trainers access the system on iPads or smartphones during active workout sessions.

### 4. Printable & Portable Invoice System
- **Decision**: Embedded a printable invoice modal configured with CSS `@media print` rules.
- **Rationale**: Facility managers can generate and print physical receipts or save PDF invoices directly from the browser without needing third-party PDF server rendering plugins.

### 5. Design System & Aesthetics
- **Decision**: Built using HSL-tailored neutral palettes (`#FAFAFA` / `#0B0F17`), 8pt grid spacing, 16px card radii, soft shadows, and subtle micro-interactions (SVG circular progress rings, confetti celebrations).
- **Rationale**: Provides a premium, enterprise-grade look and feel comparable to Linear, Stripe Dashboard, and Apple Health.
