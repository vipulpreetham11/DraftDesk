import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Edit3, Loader2, User } from 'lucide-react';
import { insforge } from '../lib/insforge';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'login' | 'signup' | 'verify';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; verify?: string }>({});

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (mode === 'verify' && otp.join('').length === 6) {
      handleVerify();
    }
  }, [otp, mode]);

  const validate = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (mode !== 'verify' && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (mode === 'signup' && name.trim().length === 0) {
      newErrors.name = 'Full name is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;
    
    setIsLoading(true);
    setErrors({});
    try {
      const { data, error } = await insforge.auth.verifyEmail({ email, otp: code });
      if (error) throw error;
      if (data?.user) setUser(data.user);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setErrors({ verify: 'Invalid code. Try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await insforge.auth.sendVerificationEmail({ email });
      setErrors({ verify: 'Code resent successfully!' });
    } catch (err: any) {
      setErrors({ verify: err.message || 'Failed to resend code' });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < 6) newOtp[index + i] = pasted[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(index + pasted.length, 5);
      otpRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const { data, error } = await insforge.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data?.user) setUser(data.user);
        navigate('/dashboard', { replace: true });
      } else if (mode === 'signup') {
        const { data, error } = await insforge.auth.signUp({
          email,
          password,
          name: name,
        });
        if (error) throw error;
        
        if (data?.requireEmailVerification) {
          setMode('verify');
          setErrors({});
        } else {
          if (data?.user) setUser(data.user);
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err: any) {
      setErrors({ ...errors, email: err.message || 'Authentication failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    await insforge.auth.signInWithOAuth({
      provider: 'google',
      redirectTo: `${window.location.origin}/dashboard`
    });
  };

  return (
    <div className="min-h-screen bg-warm-50 font-body flex flex-col items-center justify-center p-4 selection:bg-coral-100 selection:text-coral-800">
      <main className="w-full max-w-[420px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <header className="mb-4 flex flex-col items-center">
          <div className="mb-2 w-10 h-10 bg-coral-400 rounded-xl flex items-center justify-center shadow-md">
            <Edit3 className="text-white w-5 h-5" />
          </div>
          <Link to="/" className="font-heading text-xl font-bold text-coral-400 tracking-tight">
            DraftDesk
          </Link>
        </header>

        {mode === 'verify' ? (
          <>
            <section className="text-center mb-4">
              <h2 className="font-heading text-xl text-charcoal font-bold mb-1">
                Check your inbox
              </h2>
              <p className="text-base text-warm-600 px-4">
                We sent a 6-digit code to {email}
              </p>
            </section>

            <div className="w-full bg-white rounded-[16px] p-5 sm:p-6 shadow-xl border border-warm-200 flex flex-col items-center">
              <form onSubmit={handleVerify} className="w-full flex flex-col items-center gap-5">
                <div className="flex gap-2 justify-center w-full">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-12 h-14 text-center font-heading text-2xl font-bold text-charcoal rounded-[10px] border ${
                        errors.verify ? 'border-red-500' : 'border-warm-200'
                      } focus:ring-1 focus:ring-coral-400 focus:border-coral-400 transition-all outline-none`}
                    />
                  ))}
                </div>
                {errors.verify && (
                  <span className={`text-xs ${errors.verify.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                    {errors.verify}
                  </span>
                )}

                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length < 6}
                  className="w-full bg-coral-400 hover:bg-coral-600 text-white font-body text-[15px] font-semibold py-3 rounded-[10px] shadow-sm transition-all transform active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Verify'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-body text-[13px] font-semibold text-coral-400 hover:text-coral-600 transition-colors"
                >
                  Didn't receive it? Resend code
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <section className="text-center mb-4">
              <h2 className="font-heading text-xl text-charcoal font-bold mb-1">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-base text-warm-600 px-4">
                Enter your details to manage your creative workspace.
              </p>
            </section>

            <div className="w-full bg-white rounded-[16px] p-5 sm:p-6 shadow-xl border border-warm-200">
              
              <nav className="flex p-1 bg-warm-100 rounded-xl mb-5" role="tablist">
                <button
                  onClick={() => { setMode('login'); setErrors({}); }}
                  className={`flex-1 py-2 rounded-[10px] font-body text-sm font-semibold transition-all duration-300 ${
                    mode === 'login'
                      ? 'bg-charcoal text-white shadow-sm'
                      : 'text-warm-600 hover:text-charcoal'
                  }`}
                  role="tab"
                  aria-selected={mode === 'login'}
                >
                  Log in
                </button>
                <button
                  onClick={() => { setMode('signup'); setErrors({}); }}
                  className={`flex-1 py-2 rounded-[10px] font-body text-sm font-semibold transition-all duration-300 ${
                    mode === 'signup'
                      ? 'bg-charcoal text-white shadow-sm'
                      : 'text-warm-600 hover:text-charcoal'
                  }`}
                  role="tab"
                  aria-selected={mode === 'signup'}
                >
                  Sign up
                </button>
              </nav>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                
                {mode === 'signup' && (
                  <div className="flex flex-col gap-1">
                    <label className="font-body text-[13px] font-semibold text-warm-600 ml-1" htmlFor="name">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 w-4 h-4" />
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className={`w-full pl-9 pr-4 py-2.5 bg-white border ${
                          errors.name ? 'border-red-500' : 'border-warm-200'
                        } rounded-[10px] font-body text-sm text-charcoal focus:ring-1 focus:ring-coral-400 focus:border-coral-400 transition-all outline-none`}
                      />
                    </div>
                    {errors.name && <span className="text-red-500 text-xs ml-1">{errors.name}</span>}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="font-body text-[13px] font-semibold text-warm-600 ml-1" htmlFor="email">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 w-4 h-4" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hello@creator.com"
                      className={`w-full pl-9 pr-4 py-2.5 bg-white border ${
                        errors.email ? 'border-red-500' : 'border-warm-200'
                      } rounded-[10px] font-body text-sm text-charcoal focus:ring-1 focus:ring-coral-400 focus:border-coral-400 transition-all outline-none`}
                    />
                  </div>
                  {errors.email && <span className="text-red-500 text-xs ml-1">{errors.email}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center ml-1">
                    <label className="font-body text-[13px] font-semibold text-warm-600" htmlFor="password">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 w-4 h-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-9 py-2.5 bg-white border ${
                        errors.password ? 'border-red-500' : 'border-warm-200'
                      } rounded-[10px] font-body text-sm text-charcoal focus:ring-1 focus:ring-coral-400 focus:border-coral-400 transition-all outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 w-full bg-coral-400 hover:bg-coral-600 text-white font-body text-[15px] font-semibold py-3 rounded-[10px] shadow-sm transition-all transform active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {mode === 'login' ? 'Logging in...' : 'Creating account...'}
                    </>
                  ) : (
                    mode === 'login' ? 'Log in to Dashboard' : 'Create account'
                  )}
                </button>

                <div className="flex items-center gap-3 my-1">
                  <div className="h-[1px] flex-1 bg-warm-200"></div>
                  <span className="font-body text-[11px] font-bold text-warm-400 uppercase tracking-widest">
                    — OR —
                  </span>
                  <div className="h-[1px] flex-1 bg-warm-200"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full bg-white border-[1.5px] border-warm-200 hover:bg-warm-50 text-charcoal font-body text-[15px] font-semibold py-2.5 rounded-[10px] flex items-center justify-center gap-2.5 transition-all"
                >
                  <img
                    alt="Google"
                    className="w-4 h-4"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv1qMKoi7WrmXRcI_-FKTncYYJ6sehONtidk5oMHlDZhbxU06L0uogc925MBWYfjZBzyaTfcZrrQOKb6ihHzWjgLQ-Lpfo8u8CECXq3amDdyMna22NkKyWacc07GcLcV91qxMmDTUAtwfi0pCySAdWqostTDjUChFOee99M0uVI2vBHprUFgjjdG0qqr6hbGTtPUcLJsEgot-aIEMxSKE-KZFTZc7ljlbwbQm4tsTYHOVBuD2bP0MEWId5bPBgFs90zXTC-AdUjC6H"
                  />
                  Continue with Google
                </button>
              </form>
            </div>
          </>
        )}

        <footer className="mt-4 text-center max-w-sm">
          <p className="font-body text-xs text-warm-400 leading-relaxed">
            By continuing, you agree to DraftDesk's{' '}
            <a href="#" className="text-coral-400 hover:text-coral-600 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-coral-400 hover:text-coral-600 transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </footer>

        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-coral-400/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      </main>
    </div>
  );
};

export default LoginPage;
