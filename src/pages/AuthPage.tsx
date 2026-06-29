import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

type AuthMode = 'login' | 'signup' | 'reset';

const InputField: React.FC<{
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightClick?: () => void;
  autoComplete?: string;
  disabled?: boolean;
}> = ({ type, placeholder, value, onChange, icon, rightIcon, onRightClick, autoComplete, disabled }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35">{icon}</div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      autoComplete={autoComplete}
      disabled={disabled}
      className="w-full h-13 pl-11 pr-12 py-3.5 bg-white/6 border border-white/12 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/35 focus:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    />
    {rightIcon && (
      <button
        type="button"
        onClick={onRightClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors"
        aria-label="Toggle visibility"
      >
        {rightIcon}
      </button>
    )}
  </div>
);

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, resetPassword } = useApp();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = (): string | null => {
    if (!email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email address';
    if (mode !== 'reset') {
      if (!password) return 'Password is required';
      if (password.length < 6) return 'Password must be at least 6 characters';
    }
    if (mode === 'signup' && !name.trim()) return 'Name is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
        navigate('/');
      } else if (mode === 'signup') {
        await signup(email.trim(), password, name.trim());
        // Supabase sends a confirmation email by default
        // If email confirmation is disabled in Supabase dashboard, this redirects immediately
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setMode('login');
      } else {
        await resetPassword(email.trim());
        setSuccess(`Password reset link sent to ${email}. Check your inbox.`);
      }
    } catch (err: any) {
      // Map Supabase error messages to friendly versions
      const msg: string = err.message || 'Something went wrong';
      if (msg.includes('Invalid login credentials')) setError('Incorrect email or password.');
      else if (msg.includes('Email not confirmed')) setError('Please confirm your email before signing in.');
      else if (msg.includes('User already registered')) setError('An account with this email already exists. Sign in instead.');
      else if (msg.includes('Password should be')) setError('Password must be at least 6 characters.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setError('');
    setSuccess('');
  };

  const titles: Record<AuthMode, string> = {
    login: 'Welcome back',
    signup: 'Create account',
    reset: 'Reset password',
  };

  const subtitles: Record<AuthMode, string> = {
    login: 'Sign in to continue watching',
    signup: 'Start streaming — free to join',
    reset: "We'll send you a reset link",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#46d369]/4 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500/4 blur-3xl" />
        <div
          className="absolute inset-0 opacity-5 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=40')" }}
        />
        <div className="absolute inset-0 bg-[#0a0a0f]/60" />
      </div>

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#46d369] flex items-center justify-center font-black text-black text-lg">
            N
          </div>
          <span className="font-black text-white text-2xl tracking-tight">Nexora</span>
        </div>

        {/* Card */}
        <div className="bg-[#111118]/90 backdrop-blur-xl border border-white/8 rounded-2xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              {mode === 'reset' && (
                <button
                  onClick={() => switchMode('login')}
                  className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-4 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to sign in
                </button>
              )}

              <h1 className="text-white font-bold text-2xl mb-1">{titles[mode]}</h1>
              <p className="text-white/40 text-sm mb-6">{subtitles[mode]}</p>

              {/* Success message */}
              {success && (
                <motion.div
                  className="flex items-start gap-3 p-3 bg-[#46d369]/10 border border-[#46d369]/25 rounded-xl mb-4"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle size={17} className="text-[#46d369] shrink-0 mt-0.5" />
                  <p className="text-[#46d369] text-sm">{success}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <InputField
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={setName}
                    icon={<User size={17} />}
                    autoComplete="name"
                    disabled={loading}
                  />
                )}

                <InputField
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={setEmail}
                  icon={<Mail size={17} />}
                  autoComplete="email"
                  disabled={loading}
                />

                {mode !== 'reset' && (
                  <InputField
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={setPassword}
                    icon={<Lock size={17} />}
                    rightIcon={showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    onRightClick={() => setShowPass(!showPass)}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    disabled={loading}
                  />
                )}

                {/* Error */}
                {error && (
                  <motion.p
                    className="text-red-400 text-xs px-1 leading-relaxed"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}

                {/* Forgot password */}
                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => switchMode('reset')}
                      className="text-white/40 hover:text-white/70 text-xs transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#46d369] hover:bg-[#3ec060] active:bg-[#35a854] text-black font-bold rounded-xl transition-all active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                >
                  {loading && <Loader2 size={17} className="animate-spin" />}
                  {!loading && (
                    mode === 'login' ? 'Sign In' :
                    mode === 'signup' ? 'Create Account' :
                    'Send Reset Link'
                  )}
                  {loading && (
                    mode === 'login' ? 'Signing in...' :
                    mode === 'signup' ? 'Creating account...' :
                    'Sending...'
                  )}
                </button>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Mode switcher */}
          <p className="text-center text-white/35 text-sm mt-5">
            {mode === 'login' ? (
              <>
                New to Nexora?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-white hover:text-[#46d369] font-medium transition-colors"
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-white hover:text-[#46d369] font-medium transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-white/20 text-xs mt-5 leading-relaxed px-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
