import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Compass,
  ArrowLeft
} from 'lucide-react';
import { 
  loginWithPassword, 
  loginWithGoogle, 
  sendSupabaseOtp, 
  verifySupabaseOtp 
} from '../lib/authApi';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '787755083002-bssll22sekige2oaedktigqitm2l4nq3.apps.googleusercontent.com';

export default function AdminLoginPage({ onLoginSuccess }) {
  // Tabs: 'password' | 'google' | 'otp'
  const [activeTab, setActiveTab] = useState('password');
  
  // Password Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Form State
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // UI / Status State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const googleBtnRef = useRef(null);

  // Clear messages on tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Quick autofill buttons for the 2 authorized founders
  const handleQuickFill = (targetEmail) => {
    if (activeTab === 'otp') {
      setOtpEmail(targetEmail);
    } else {
      setEmail(targetEmail);
    }
    setErrorMessage('');
  };

  // ============================================================================
  // 1. PASSWORD LOGIN HANDLER
  // ============================================================================
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both admin email and password.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await loginWithPassword(email.trim(), password);
      setSuccessMessage(`Welcome back, ${res.admin?.name || 'Admin'}! Initializing Command Center...`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(res.admin);
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 2. GOOGLE OAUTH 2.0 HANDLER (Google Identity Services)
  // ============================================================================
  useEffect(() => {
    if (activeTab !== 'google') return;

    function initGoogleBtn() {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false
          });

          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'filled_black',
            size: 'large',
            shape: 'pill',
            text: 'continue_with',
            width: 320
          });
        } catch (err) {
          console.warn('Google Identity button initialization error:', err);
        }
      }
    }

    // Try immediately, or retry if script is still loading
    initGoogleBtn();
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        initGoogleBtn();
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) {
      setErrorMessage('Google did not return an authentication credential.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const res = await loginWithGoogle(response.credential);
      setSuccessMessage(`Google Verified: Welcome ${res.admin?.name || 'Admin'}!`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(res.admin);
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Google authentication failed. Only whitelisted founder accounts are authorized.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 3. SUPABASE OTP HANDLERS
  // ============================================================================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otpEmail.trim()) {
      setErrorMessage('Please enter an authorized founder email to receive OTP.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await sendSupabaseOtp(otpEmail.trim());
      setOtpSent(true);
      setOtpCountdown(60);
      setSuccessMessage(res.message || 'OTP verification code dispatched via Supabase!');
    } catch (err) {
      setErrorMessage(err.message || 'Could not dispatch OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await verifySupabaseOtp(otpEmail.trim(), otpCode.trim());
      setSuccessMessage(`OTP Verified! Opening Command Center...`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(res.admin);
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer for resend OTP
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(p => p - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  return (
    <div className="min-h-screen bg-[#070708] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans select-none">
      
      {/* Background Ambient Glows & Mountain Grid */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#E5383B]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#FFD700]/10 blur-[130px] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" 
      />

      {/* Back to Public Site Link */}
      <div className="absolute top-6 left-6 z-20">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Public Website</span>
        </a>
      </div>

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-md bg-neutral-900/90 backdrop-blur-2xl border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(229,56,59,0.12)]">
        
        {/* Header Emblem */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E5383B] to-[#990000] p-0.5 shadow-xl shadow-[#E5383B]/20 mx-auto">
            <div className="w-full h-full rounded-2xl bg-neutral-950 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#FFD700]" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neutral-800/80 border border-neutral-700/80 text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-1">
              <Sparkles className="w-3 h-3 text-[#FFD700]" />
              <span>Founder Security Gate</span>
            </div>
            <h1 className="font-outfit font-black text-2xl sm:text-3xl tracking-tight text-white">
              TrekToShikhar CRM
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Authorized personnel only. Whitelisted founder accounts enforced.
            </p>
          </div>
        </div>

        {/* Founder Whitelist Notification Pill */}
        <div className="mb-5 p-2.5 rounded-2xl bg-black/40 border border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#E5383B] shrink-0" />
            <span className="font-medium">Strict 2-Admin Whitelist Active</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Protected" />
        </div>

        {/* Quick Founder Select Pills */}
        <div className="mb-5">
          <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Quick Founder Select:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('Vinaypathak2772@gmail.com')}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                (activeTab === 'otp' ? otpEmail : email).toLowerCase() === 'vinaypathak2772@gmail.com'
                  ? 'border-[#E5383B] bg-[#E5383B]/10 text-white font-bold'
                  : 'border-neutral-800 bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              <span className="font-bold block truncate">Vinay Pathak</span>
              <span className="text-[10px] text-neutral-400 block truncate">Vinaypathak2772...</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('trektoshikhar@gmail.com')}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                (activeTab === 'otp' ? otpEmail : email).toLowerCase() === 'trektoshikhar@gmail.com'
                  ? 'border-[#E5383B] bg-[#E5383B]/10 text-white font-bold'
                  : 'border-neutral-800 bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              <span className="font-bold block truncate">Kunal Satyal</span>
              <span className="text-[10px] text-neutral-400 block truncate">trektoshikhar...</span>
            </button>
          </div>
        </div>

        {/* Authentication Mode Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-black/60 border border-neutral-800 mb-5">
          <button
            type="button"
            onClick={() => handleTabChange('password')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'password'
                ? 'bg-[#E5383B] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('google')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'google'
                ? 'bg-[#E5383B] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Google Auth
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('otp')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'otp'
                ? 'bg-[#E5383B] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Supabase OTP
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="leading-snug">{successMessage}</p>
          </div>
        )}

        {/* ====================================================================
            TAB 1: PASSWORD LOGIN (DIRECT CREDENTIALS)
           ==================================================================== */}
        {activeTab === 'password' && (
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. Vinaypathak2772@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black/50 border border-neutral-700/80 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#E5383B] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Master Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter assigned master password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/50 border border-neutral-700/80 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#E5383B] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-white hover:to-white hover:text-[#0A0A0A] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-[0_10px_25px_rgba(229,56,59,0.35)] hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate &amp; Enter CRM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ====================================================================
            TAB 2: GOOGLE OAUTH 2.0 (ONE-CLICK FOUNDER SIGN IN)
           ==================================================================== */}
        {activeTab === 'google' && (
          <div className="space-y-4 py-2 text-center">
            <p className="text-xs text-neutral-300 leading-relaxed max-w-xs mx-auto">
              Sign in with your verified Google Account. Access is strictly granted to <strong className="text-white">Vinay</strong> and <strong className="text-white">Kunal</strong>.
            </p>

            <div className="flex justify-center pt-2">
              <div ref={googleBtnRef} className="min-h-[44px]" />
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                <div className="w-4 h-4 border-2 border-[#E5383B] border-t-transparent rounded-full animate-spin" />
                <span>Validating Google token against founder whitelist...</span>
              </div>
            )}

            <div className="pt-2 text-[11px] text-neutral-500 border-t border-neutral-800">
              🔒 Powered by Google Identity Services &amp; Server-Side Whitelist Gate
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: SUPABASE OTP (6-DIGIT EMAIL CODE)
           ==================================================================== */}
        {activeTab === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                    Founder Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      placeholder="e.g. trektoshikhar@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black/50 border border-neutral-700/80 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#E5383B] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-[#E5383B] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Dispatching OTP...' : 'Send 6-Digit Code via Supabase'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Enter 6-Digit Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] text-[#FFD700] hover:underline cursor-pointer"
                    >
                      Change Email
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 849201"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-black/50 border border-neutral-700/80 text-white placeholder-neutral-500 text-center tracking-[8px] font-mono text-lg font-bold focus:outline-none focus:border-[#E5383B] transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Dispatched to: <span className="text-white font-bold">{otpEmail}</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5383B] to-[#C92A2A] hover:from-white hover:to-white hover:text-[#0A0A0A] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Verifying OTP...' : 'Verify & Open CRM'}
                </button>

                <div className="text-center">
                  {otpCountdown > 0 ? (
                    <span className="text-[11px] text-neutral-500">
                      Resend code in {otpCountdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs text-[#FFD700] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Resend 6-Digit Code</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* Footer Security Stamp */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400">
          <span>Session: 7-Day httpOnly JWT</span>
          <span className="text-neutral-400 font-mono">TrekToShikhar v2.0</span>
        </div>

      </div>
    </div>
  );
}
