import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
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
}> = ({ type, placeholder, value, onChange, icon, rightIcon, onRightClick, autoComplete }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35">{icon}</div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      autoComplete={autoComplete}
      className="w-full h-13 pl-11 pr-12 py-3.5 bg-white/6 border border-white/12 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/35 focus:bg-white/10 transition-all"
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
  const { login, signup } = useApp();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Email is required'); return; }
    if (mode !== 'reset' && !password) { setError('Password is required'); return; }
    if (mode === 'signup' && !name) { setError('Name is required'); return; }
    if (mode !== 'reset' && password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/');
      } else if (mode === 'signup') {
        await signup(email, password, name);
        navigate('/');
      } else {
        // mock reset
        await new Promise(r => setTimeout(r, 1000));
        setResetSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<AuthMode, string> = {
    login: 'Welcome back',
    signup: 'Create account',
    reset: 'Reset password',
  };

  const subtitles: Record<AuthMode, string> = {
    login: 'Sign in to continue watching',
    signup: 'Start your free 30-day trial',
    reset: 'We\'ll send you a reset link',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#46d369]/4 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500/4 blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=50')] bg-cover bg-center opacity-5" />
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
            C
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
              transition={{ duration: 0.25 }}
            >
              {/* Back button for reset */}
              {mode === 'reset' && (
                <button
                  onClick={() => { setMode('login'); setResetSent(false); setError(''); }}
                  className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-4 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to login
                </button>
              )}

              <h1 className="text-white font-bold text-2xl mb-1">{titles[mode]}</h1>
              <p className="text-white/40 text-sm mb-6">{subtitles[mode]}</p>

              {resetSent ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-[#46d369]/15 flex items-center justify-center mx-auto mb-3">
                    <Mail size={22} className="text-[#46d369]" />
                  </div>
                  <p className="text-white font-medium mb-1">Check your email</p>
                  <p className="text-white/40 text-sm">We sent a reset link to {email}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {mode === 'signup' && (
                    <InputField
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={setName}
                      icon={<User size={17} />}
                      autoComplete="name"
                    />
                  )}

                  <InputField
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={setEmail}
                    icon={<Mail size={17} />}
                    autoComplete="email"
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
                    />
                  )}

                  {/* Error */}
                  {error && (
                    <motion.p
                      className="text-red-400 text-xs px-1"
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
                        onClick={() => { setMode('reset'); setError(''); }}
                        className="text-white/40 hover:text-white/70 text-xs transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#46d369] hover:bg-[#3ec060] text-black font-bold rounded-xl transition-all active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  >
                    {loading && <Loader2 size={17} className="animate-spin" />}
                    {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                  </button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Mode switcher */}
          {!resetSent && (
            <p className="text-center text-white/35 text-sm mt-5">
              {mode === 'login' ? (
                <>
                  New to Nexora?{' '}
                  <button onClick={() => { setMode('signup'); setError(''); }} className="text-white hover:text-[#46d369] font-medium transition-colors">
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => { setMode('login'); setError(''); }} className="text-white hover:text-[#46d369] font-medium transition-colors">
                    Sign in
                  </button>
                </>
              )}
            </p>
          )}
        </div>

        {/* Terms */}
        <p className="text-center text-white/20 text-xs mt-5 leading-relaxed px-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
