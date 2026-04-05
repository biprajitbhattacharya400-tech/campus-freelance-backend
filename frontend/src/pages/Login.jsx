import React, { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import zyloSignature from '../assets/zylo-signature.svg';
import { AuthContext } from '../context/AuthContext';
import { getUserMe, loginUser } from '../services/api';
import { setToken } from '../utils/auth';

const Login = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      setToken(response.data.access_token);

      const userResponse = await getUserMe();
      setUser(userResponse.data);
      toast.success('Welcome back');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="auth-grid">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="auth-copy-panel"
        >
          <div className="floating-orb left-[-5rem] top-[-4rem] h-40 w-40 bg-cyan-300/[0.24]" />
          <div className="floating-orb bottom-[-4rem] right-[-2rem] h-48 w-48 bg-fuchsia-400/[0.18]" />

          <div className="relative z-10">
            <div className="badge-chip mb-6">
              <Sparkles size={14} />
              Sign back into your workspace
            </div>

            <h1 className="font-display text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
              Keep every campus project moving in one place.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/80">
              Log in to browse fresh gigs, manage your posted tasks, assign collaborators, and continue project chats without losing context.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                ['Task board', 'Browse active campus work'],
                ['Secure session', 'Token-based auth already wired'],
                ['Project chat', 'Keep messages tied to each task'],
                ['Owner controls', 'Assign applicants with less friction'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3 text-white">
                    <ShieldCheck size={18} className="text-cyan-300" />
                    <span className="font-semibold">{title}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/80">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          className="auth-form-panel"
        >
          <div className="mb-8">
            <img src={zyloSignature} alt="ZYLO" className="brand-logo mb-5 h-9 w-auto" />
            <p className="section-kicker">Welcome back</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">Sign in to ZYLO</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              New here?{' '}
              <Link to="/register" className="font-semibold text-[var(--brand-600)] hover:text-[var(--brand-700)]">
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  className="input-shell pl-11"
                  placeholder="you@campus.edu"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-shell pl-11 pr-11"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="icon-button absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[var(--brand-600)] focus:ring-sky-200" />
                Remember me
              </label>
              <span className="text-slate-400 dark:text-slate-500">Secure access enabled</span>
            </div>

            <button type="submit" disabled={isLoading} className="btn-dark w-full px-5 py-3.5">
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin" size={18} />
                  Signing in
                </>
              ) : (
                <>
                  Continue to dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
