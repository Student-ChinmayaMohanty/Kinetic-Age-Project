# ⚡ KineticOS — Session & Subscription Management System

> **Commercial-Grade B2B SaaS Management Platform** for fitness centers, wellness clinics, physiotherapy practices, and elite personal trainers.

KineticOS is built with **Vite 8, React 19, TypeScript, Tailwind CSS v4, Lucide Icons, and Recharts**. It combines design principles inspired by **Linear, Stripe Dashboard, Apple Health, Notion, and Raycast**.

---

## 🌟 Key Features

- **📊 Analytics Dashboard**:
  - Top KPI stat cards with trend sparklines (Active Clients, Revenue, Today's Sessions, Pending Payments).
  - Recharts Revenue & Session Growth area chart and Subscription Mix donut chart.
  - 1-Click Session Check-in with confetti celebrations.
  - Live Team Activity Stream with real-time broadcast note posting.
  - Interactive time-range filters (`7d`, `30d`, `90d`, `ytd`).

- **👥 Client CRM & Deep Profiles**:
  - Searchable client directory table with multi-filter pills (Plan, Status), column sorting, row selection, and pagination.
  - Deep Client Profile Modal featuring a **90-Day Attendance Matrix (GitHub-style heatmap)**, **Health Score Gauge (0-100)**, weight trajectory line chart, and trainer observation log editor.

- **💳 Subscription Engine**:
  - Tiered plans: 1 Month Pass, 3 Months Pro, 6 Months Elite, Custom Enterprise.
  - SVG circular progress rings tracking days remaining and auto-expiration risk alerts.
  - 1-Click Renewal workflow.

- **💰 Payments & Multi-Installment Ledger**:
  - Financial breakdown (Total Collected vs Scheduled Installments).
  - Payment method support (**UPI**, Credit Card, Cash, Bank Transfer).
  - Dynamic Invoice Generator with printable receipt modal (`@media print`).

- **📅 Session Tracking (Calendar & Schedule List)**:
  - Dual View: Interactive Monthly Calendar + Daily Schedule List.
  - Attendance status toggles (Completed, Missed, Cancelled, In-Progress).
  - Workout summary, mood rating (1-5 stars), calories burned counter, and trainer notes.

- **📈 Reports & CSV Export Studio**:
  - Cohort attendance rate aggregate and compliance breakdown.
  - Live CSV Exporter button (triggers real `.csv` file download).

- **🔒 Enterprise Authentication & RBAC Engine**:
  - WebAuthn Passkey Touch ID biometric verification.
  - 6-Digit OTP SMS/WhatsApp Pin challenge.
  - Magic Link passwordless email dispatcher.
  - **Role Sandbox Simulator**: Test app live under 4 roles (`Super Admin`, `Center Manager`, `Head Trainer`, `Staff Analyst`).
  - **Granular Access Controls**: Automatic function locks when signed out or unauthorized (`🔒 Protected Function`).
  - Active Device Sessions Manager with remote session revocation.

- **⚡ Power Tools**:
  - **Command Palette (`Cmd + K` / `Ctrl + K`)**: Keyboard-driven Spotlight search.
  - Dark / Light Mode automatic toggle.
  - Simulated Skeleton Loading state toggle.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Student-ChinmayaMohanty/Kinetic-Age-Project.git
   cd Kinetic-Age-Project
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/` (or the port specified in terminal).

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🧪 Testing & Verification Guide

- **Testing Command Palette**: Press `Cmd + K` (Mac) or `Ctrl + K` (Windows) to trigger global search.
- **Testing RBAC Permission Locks**:
  1. Click top-right avatar -> **Sign Out**.
  2. Notice `Onboard Member` and `Log Payment` buttons show `🔒` lock indicators.
  3. Navigate to **Settings** -> Observe the *Super Admin Access Required* lock overlay.
  4. Click **Authenticate as Super Admin** to sign back in and restore all privileges.
- **Testing CSV Export**: Go to **Reports** -> Click **Export CSV** to download client records.
- **Testing 1-Click Check-in**: Go to **Dashboard** or **Sessions** -> Click **Check-in** on an upcoming appointment.

---

## 🎨 Design System & Spacing Tokens

| Element | Specification |
| :--- | :--- |
| **Primary Accent** | `#2563EB` (Royal Sapphire) |
| **Light Surface / Bg** | `#FFFFFF` / `#FAFAFA` |
| **Dark Surface / Bg** | `#111827` / `#0B0F17` |
| **Card Border Radius** | `16px` (`rounded-3xl` / `rounded-2xl`) |
| **Button / Input Radius** | `12px` (`rounded-xl`) |
| **Spacing Grid** | 8pt System (`8`, `16`, `24`, `32`, `48`, `64`) |
| **Typography** | Inter / Geist font hierarchy |
