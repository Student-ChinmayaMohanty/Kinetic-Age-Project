import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import type { UserRole } from '../../types';
import { 
  Activity, Lock, Mail, ArrowRight, Fingerprint, 
  ShieldCheck, Globe, ShieldAlert, Monitor, Laptop, 
  Trash2, RefreshCw, CheckCircle2, UserCheck, Key, Check
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    userSessions, 
    revokeSession, 
    revokeAllOtherSessions,
    securityLogs,
    toggleTwoFactor,
    isAuthenticated,
    signIn,
    signOut,
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'sandbox' | 'rbac' | 'security'>('login');
  const [authMethod, setAuthMethod] = useState<'password' | 'passkey' | 'otp' | 'magic'>('password');
  
  // Login Form State
  const [email, setEmail] = useState('aarav.sharma@apex.in');
  const [password, setPassword] = useState('••••••••••••');
  const [otpCode, setOtpCode] = useState(['8', '4', '9', '2', '0', '1']);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [passkeySuccess, setPasskeySuccess] = useState(false);

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length < 6) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (pwd.length < 10) return { score: 2, text: 'Good', color: 'bg-amber-500' };
    return { score: 3, text: 'Enterprise Shield', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      signIn();
    }, 800);
  };

  const handlePasskeyAuth = () => {
    setIsAuthenticating(true);
    setPasskeySuccess(false);
    setTimeout(() => {
      setIsAuthenticating(false);
      setPasskeySuccess(true);
      signIn();
    }, 1000);
  };

  const handleSendMagicLink = () => {
    addToast('Magic Link Sent!', `One-click login link sent to ${email}`, 'info');
  };

  const rolesList: { role: UserRole; desc: string; color: string }[] = [
    { role: 'Super Admin', desc: 'Unrestricted full platform access, billing, and staff management', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
    { role: 'Center Manager', desc: 'Client directory, financial ledgers, and staff schedule control', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    { role: 'Head Trainer', desc: 'Workout logging, session attendance check-ins, and client notes', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    { role: 'Staff Analyst', desc: 'Read-only analytics reports and attendance metrics', color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' }
  ];

  const rbacMatrix = [
    { feature: 'Dashboard Analytics & KPI Metrics', admin: true, manager: true, trainer: true, analyst: true },
    { feature: 'Client Directory (Create & Edit PII)', admin: true, manager: true, trainer: true, analyst: false },
    { feature: 'Financial Ledger & Invoicing', admin: true, manager: true, trainer: false, analyst: false },
    { feature: 'Session Attendance & Check-in Override', admin: true, manager: true, trainer: true, analyst: false },
    { feature: 'Reports & CSV Data Exporter', admin: true, manager: true, trainer: false, analyst: true },
    { feature: 'System Settings & Staff RBAC Roles', admin: true, manager: false, trainer: false, analyst: false }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Enterprise Authentication & RBAC Control Hub
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Multi-factor WebAuthn passkeys, role-based access control, and active session security
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="info">
            Active Role: {currentUser.role}
          </Badge>
        </div>
      </div>

      {/* Top Hub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3 overflow-x-auto">
        {[
          { id: 'login', label: 'Auth Gateway Portal', icon: Lock },
          { id: 'sandbox', label: 'Role Sandbox Switcher', icon: UserCheck },
          { id: 'rbac', label: 'RBAC Permission Matrix', icon: Key },
          { id: 'security', label: 'Active Devices & Audit Log', icon: Laptop }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: AUTH GATEWAY PORTAL */}
      {activeTab === 'login' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Auth Card */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <Activity className="w-5 h-5 animate-pulse-subtle" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">KineticOS Auth Gateway</h3>
                  <p className="text-xs text-gray-500">Select your preferred secure authentication protocol</p>
                </div>
              </div>
            </div>

            {/* Auth Method Selector */}
            <div className="grid grid-cols-4 gap-2 p-1.5 rounded-2xl bg-gray-100 dark:bg-gray-800/60 text-xs font-bold">
              <button
                onClick={() => setAuthMethod('password')}
                className={`py-2 rounded-xl transition-all ${authMethod === 'password' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-gray-500'}`}
              >
                Password
              </button>
              <button
                onClick={() => setAuthMethod('passkey')}
                className={`py-2 rounded-xl transition-all ${authMethod === 'passkey' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-gray-500'}`}
              >
                Passkey 🔑
              </button>
              <button
                onClick={() => setAuthMethod('otp')}
                className={`py-2 rounded-xl transition-all ${authMethod === 'otp' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-gray-500'}`}
              >
                OTP Pin
              </button>
              <button
                onClick={() => setAuthMethod('magic')}
                className={`py-2 rounded-xl transition-all ${authMethod === 'magic' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-gray-500'}`}
              >
                Magic Link
              </button>
            </div>

            {/* METHOD 1: Password Login */}
            {authMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  {/* Password Strength Gauge */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${(strength.score / 3) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">{strength.text}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In with SSO</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* METHOD 2: WebAuthn Passkey */}
            {authMethod === 'passkey' && (
              <div className="p-8 text-center space-y-4 border-2 border-dashed border-blue-500/30 rounded-3xl bg-blue-50/20 dark:bg-blue-950/20 animate-in fade-in duration-150">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30 animate-pulse">
                  <Fingerprint className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-gray-900 dark:text-white">WebAuthn Biometric Passkey</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Touch ID / Face ID registered for <span className="font-bold text-blue-600">{currentUser.email}</span>
                  </p>
                </div>

                {passkeySuccess ? (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Passkey Token Validated
                  </div>
                ) : (
                  <button
                    onClick={handlePasskeyAuth}
                    disabled={isAuthenticating}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all inline-flex items-center gap-2"
                  >
                    {isAuthenticating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                    <span>Authenticate via Touch ID / Hardware Key</span>
                  </button>
                )}
              </div>
            )}

            {/* METHOD 3: OTP 6-Digit Pin */}
            {authMethod === 'otp' && (
              <div className="space-y-4 text-center animate-in fade-in duration-150">
                <p className="text-xs text-gray-500">
                  Enter 6-digit verification code sent via WhatsApp to <span className="font-bold">{currentUser.phone}</span>
                </p>

                <div className="flex items-center justify-center gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...otpCode];
                        newOtp[idx] = e.target.value;
                        setOtpCode(newOtp);
                      }}
                      className="w-11 h-12 text-center text-lg font-bold font-mono border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  ))}
                </div>

                <button
                  onClick={handlePasswordLogin}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                >
                  Verify OTP Code
                </button>
              </div>
            )}

            {/* METHOD 4: Magic Link */}
            {authMethod === 'magic' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Enter Email Address for Passwordless Login
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium"
                  />
                </div>

                <button
                  onClick={handleSendMagicLink}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Send Instant Magic Link
                </button>
              </div>
            )}

            {/* Social Enterprise SSO */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block text-center">
                Or authenticate with Enterprise SSO
              </span>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handlePasswordLogin}
                  className="py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <Globe className="w-4 h-4 text-blue-500" /> Google Workspace
                </button>
                <button 
                  onClick={handlePasswordLogin}
                  className="py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Microsoft Azure AD
                </button>
              </div>
            </div>
          </div>

          {/* Active Logged-In User Profile Info */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-gray-900 to-blue-950 text-white border border-gray-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
              />
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">Current Session</span>
                <h3 className="text-xl font-extrabold">{currentUser.name}</h3>
                <p className="text-xs text-gray-400">{currentUser.email}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Security Role:</span>
                <span className="font-bold text-emerald-400">{currentUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">2FA Status:</span>
                <span className="font-bold text-blue-400">{currentUser.twoFactorEnabled ? 'Active (TOTP)' : 'Disabled'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Biometric Passkey:</span>
                <span className="font-bold text-purple-400">{currentUser.passkeyRegistered ? 'Registered' : 'Not setup'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {isAuthenticated ? (
                <button
                  onClick={signOut}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" /> Sign Out
                </button>
              ) : (
                <button
                  onClick={signIn}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sign In
                </button>
              )}

              <button
                onClick={toggleTwoFactor}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
              >
                {currentUser.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLE SANDBOX SWITCHER */}
      {activeTab === 'sandbox' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Role Sandbox Simulator
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Instantly switch user roles to test granular authorization and UI button availability across KineticOS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rolesList.map((r) => {
              const isCurrent = currentUser.role === r.role;
              return (
                <div
                  key={r.role}
                  onClick={() => switchRole(r.role)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30 scale-105'
                      : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isCurrent ? 'bg-white/20 text-white' : r.color}`}>
                      {r.role}
                    </span>
                    {isCurrent && <Check className="w-5 h-5 text-white" />}
                  </div>
                  <h4 className={`font-extrabold text-sm mb-1 ${isCurrent ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {r.role}
                  </h4>
                  <p className={`text-xs ${isCurrent ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {r.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: RBAC PERMISSION MATRIX */}
      {activeTab === 'rbac' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Granular Authorization Matrix</h3>
            <p className="text-xs text-gray-500">Feature access constraints enforced across roles</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Platform Module / Feature</th>
                  <th className="p-4 text-center">Super Admin</th>
                  <th className="p-4 text-center">Center Manager</th>
                  <th className="p-4 text-center">Head Trainer</th>
                  <th className="p-4 text-center">Staff Analyst</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {rbacMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">{row.feature}</td>
                    <td className="p-4 text-center">{row.admin ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <ShieldAlert className="w-4 h-4 text-gray-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.manager ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <ShieldAlert className="w-4 h-4 text-gray-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.trainer ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <ShieldAlert className="w-4 h-4 text-gray-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.analyst ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <ShieldAlert className="w-4 h-4 text-gray-300 mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVE SESSIONS & SECURITY AUDIT LOG */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Active Devices */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-blue-600" />
                  Active Device Sessions ({userSessions.length})
                </h3>
                <p className="text-xs text-gray-500">Revoke unauthorized or stale device logins</p>
              </div>

              <button
                onClick={revokeAllOtherSessions}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Revoke All Other Sessions
              </button>
            </div>

            <div className="space-y-3">
              {userSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900 dark:text-white">{session.deviceName}</span>
                        {session.isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                            Current Device
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {session.browser} • IP: {session.ipAddress} • {session.location}
                      </p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      onClick={() => revokeSession(session.id)}
                      className="px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-rose-500 hover:text-white text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Security Audit Log</h3>
              <p className="text-xs text-gray-500">Real-time authentication activity and threat monitoring</p>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Event Description</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {securityLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{log.event}</td>
                    <td className="p-4 text-gray-500 font-mono">{log.timestamp}</td>
                    <td className="p-4 text-gray-500 font-mono">{log.ip}</td>
                    <td className="p-4 text-right">
                      <Badge variant={log.status === 'Success' ? 'success' : 'danger'}>
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
