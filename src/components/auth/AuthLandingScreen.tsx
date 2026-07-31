import React, { useState } from 'react';
import { useApp, ROLE_PROFILES } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import type { UserRole } from '../../types';
import { 
  Activity, Lock, Mail, ArrowRight, Fingerprint, 
  ShieldCheck, CheckCircle2, RefreshCw, Key, Shield, Zap, Sparkles,
  Smartphone, MessageSquareCheck, ArrowLeft, Check, Sun, Moon
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AuthLandingScreen: React.FC = () => {
  const { 
    signIn, 
    switchRole,
    currentUser,
    isDarkMode,
    toggleDarkMode,
    addToast
  } = useApp();

  const [authMethod, setAuthMethod] = useState<'otp' | 'password' | 'passkey'>('otp');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role || 'Super Admin');
  
  // Forms state
  const [email, setEmail] = useState(currentUser.email || 'aarav.sharma@apex.in');
  const [password, setPassword] = useState('••••••••••••');
  
  // 2-Step Mobile OTP State
  const [otpStep, setOtpStep] = useState<'phone' | 'verify'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone || '+91 98201 99887');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const roleList: UserRole[] = ['Super Admin', 'Center Manager', 'Head Trainer', 'Staff Analyst'];

  const handleRoleSelect = (r: UserRole) => {
    setSelectedRole(r);
    switchRole(r);
    const profile = ROLE_PROFILES[r];
    setEmail(profile.email);
    setPhoneNumber(profile.phone);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      addToast('Invalid Phone Number', 'Please enter a valid mobile number with country code.', 'warning');
      return;
    }

    setIsSendingOtp(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setEnteredOtp(code.split(''));
      setIsSendingOtp(false);
      setOtpStep('verify');
      addToast('OTP Code Sent!', `Verification PIN [${code}] sent to ${phoneNumber}`, 'success');
    }, 700);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = enteredOtp.join('');
    
    if (finalCode.length < 6) {
      addToast('Incomplete PIN', 'Please enter all 6 digits of the OTP PIN.', 'warning');
      return;
    }

    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      addToast('Verification Successful!', `OTP verified for ${currentUser.name} (${currentUser.role}).`, 'success');
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      signIn();
    }, 800);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      addToast('Authenticated!', `Welcome back, ${currentUser.name}.`, 'success');
      confetti({ particleCount: 50, spread: 50 });
      signIn();
    }, 700);
  };

  const handlePasskeyLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      addToast('Passkey Verified', `Biometric Touch ID authentication passed for ${currentUser.name}.`, 'success');
      confetti({ particleCount: 80, spread: 70 });
      signIn();
    }, 900);
  };

  const handleQuickSuperAdminLogin = () => {
    handleRoleSelect('Super Admin');
    addToast('Super Admin Loaded', 'Entering KineticOS as Aarav Sharma.', 'info');
    signIn();
    confetti({ particleCount: 90, spread: 70 });
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-[#0B0F17] text-gray-900 dark:text-gray-100 flex flex-col justify-between relative overflow-hidden font-sans transition-colors duration-200 antialiased selection:bg-blue-500 selection:text-white">
      {/* Dynamic Background Glow Gradients matching main App */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-[130px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 dark:bg-purple-600/20 blur-[140px] pointer-events-none animate-pulse-subtle" />

      {/* Top Header Navigation matching Navbar.tsx */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between relative z-10 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-b-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Activity className="w-5 h-5 animate-pulse-subtle" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
              Kinetic<span className="text-blue-600 dark:text-blue-400">OS</span>
            </h1>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">
              Session & Sub System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="info">
            v2.4 Enterprise Shield
          </Badge>

          {/* Theme Switcher Button matching Navbar */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200/80 dark:border-gray-800"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
          </button>

          <button
            onClick={handleQuickSuperAdminLogin}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            Sign In as Super Admin
          </button>
        </div>
      </header>

      {/* Main Authentication Grid */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 flex-1">
        {/* Left Column: Security Overview & Selected Identity Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2">
            <Badge variant="success">
              <ShieldCheck className="w-3.5 h-3.5" /> Protected Session Gateway
            </Badge>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
              Enterprise Identity & Security for <span className="text-blue-600 dark:text-blue-400">KineticOS</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              Unified member directory, multi-installment payment ledgers, and appointment session control platform.
            </p>
          </div>

          {/* Active Identity Card matching Dashboard Card aesthetics */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-slate-900 to-blue-950 text-white border border-gray-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Selected User Identity
              </span>
              <Badge variant={selectedRole === 'Super Admin' ? 'success' : selectedRole === 'Center Manager' ? 'info' : 'warning'}>
                {selectedRole}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/80 shadow-md"
              />
              <div>
                <h3 className="text-lg font-black text-white leading-tight">{currentUser.name}</h3>
                <p className="text-xs text-gray-300 mt-0.5">{currentUser.email}</p>
                <p className="text-[11px] text-blue-400 font-mono font-semibold mt-0.5">{currentUser.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-gray-400 block font-medium">Access Scope</span>
                <strong className="text-white font-bold">{selectedRole === 'Super Admin' ? 'Full System Admin' : selectedRole}</strong>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-gray-400 block font-medium">2FA Protection</span>
                <strong className="text-emerald-400 font-bold">Mobile OTP Active</strong>
              </div>
            </div>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Smartphone, title: '2-Step Mobile OTP', desc: 'Instant 6-digit pin verification' },
              { icon: Fingerprint, title: 'Touch ID Passkeys', desc: 'Biometric WebAuthn hardware key' },
              { icon: Key, title: 'Dynamic RBAC', desc: 'Role-specific name profiles' },
              { icon: Shield, title: 'Encrypted Persistence', desc: 'Browser local storage sync' }
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-2xs flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{f.title}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Main Login Portal Card */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* Role Selection Cards with Avatar and Name */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Select Role & Staff Profile
                </label>
                <span className="text-[11px] text-gray-500">Switch identity profile</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleList.map((r) => {
                  const profile = ROLE_PROFILES[r];
                  const isSelected = selectedRole === r;
                  return (
                    <div
                      key={r}
                      onClick={() => handleRoleSelect(r)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-gray-900 dark:text-white ring-2 ring-blue-500/40 shadow-md'
                          : 'bg-gray-50/50 dark:bg-gray-800/40 border-gray-200/80 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-500/40'
                      }`}
                    >
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-10 h-10 rounded-xl object-cover border border-blue-500/30 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-gray-900 dark:text-white truncate">{profile.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                        </div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 block truncate">{r}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Protocol Tabs matching main app tab switcher */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
                {(['otp', 'password', 'passkey'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      setAuthMethod(method);
                      if (method === 'otp') setOtpStep('phone');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      authMethod === method
                        ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {method === 'otp' ? '📲 Mobile OTP' : method === 'passkey' ? '🔑 Passkey' : '🔒 Password'}
                  </button>
                ))}
              </div>

              <Badge variant="success">
                Identity Verified
              </Badge>
            </div>

            {/* PROTOCOL 1: 2-Step Mobile OTP Flow */}
            {authMethod === 'otp' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {otpStep === 'phone' ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Mobile Phone Number for {currentUser.name} ({selectedRole})
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 absolute left-3.5 top-3.5 text-blue-500" />
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91 98000 00000"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        A 6-digit OTP security PIN will be sent via SMS / WhatsApp.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSendingOtp ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Send OTP Verification Code</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 text-center animate-in fade-in duration-150">
                    <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquareCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>OTP sent to <strong>{phoneNumber}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpStep('phone')}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3 h-3" /> Change
                      </button>
                    </div>

                    {generatedOtp && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
                        🔑 Demo Security Code: <span className="text-white text-sm bg-emerald-600 px-2.5 py-0.5 rounded-lg shadow-xs">{generatedOtp}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Enter 6-Digit Verification PIN
                      </label>

                      <div className="flex items-center justify-center gap-2">
                        {enteredOtp.map((digit, idx) => (
                          <input
                            key={idx}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const newArr = [...enteredOtp];
                              newArr[idx] = e.target.value;
                              setEnteredOtp(newArr);
                            }}
                            className="w-11 h-12 text-center text-lg font-mono font-bold border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp}
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isVerifyingOtp ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify OTP & Sign In as {currentUser.name}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* PROTOCOL 2: Password Login Form */}
            {authMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isAuthenticating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Sign In with Password</span>}
                </button>
              </form>
            )}

            {/* PROTOCOL 3: WebAuthn TouchID Passkey */}
            {authMethod === 'passkey' && (
              <div className="p-8 text-center space-y-4 border-2 border-dashed border-blue-500/30 rounded-3xl bg-blue-50/40 dark:bg-blue-950/20 animate-in fade-in duration-150">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30 animate-pulse-subtle">
                  <Fingerprint className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-gray-900 dark:text-white">Touch ID / Biometric Passkey</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                    Biometric hardware key authentication for <span className="font-bold text-blue-600 dark:text-blue-400">{currentUser.name}</span> ({selectedRole})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePasskeyLogin}
                  disabled={isAuthenticating}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  {isAuthenticating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                  <span>Scan Touch ID / Hardware Key</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Matching App Style */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 border-t border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 relative z-10 gap-2">
        <p>© 2026 KineticOS Enterprise Health Platform. All rights reserved.</p>
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 font-medium">
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> SSL Encrypted</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> SOC2 Compliant</span>
        </div>
      </footer>
    </div>
  );
};
