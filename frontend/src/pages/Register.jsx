import React, { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react';
import { toast } from 'react-toastify';
import zyloSignature from '../assets/zylo-signature.svg';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../services/api';

const Register = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(formData);
      toast.success('Registration successful');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to register');
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
          <div className="floating-orb left-[-6rem] top-[20%] h-48 w-48 bg-cyan-300/[0.18]" />
          <div className="floating-orb bottom-[-4rem] right-[-3rem] h-56 w-56 bg-violet-400/20" />

          <div className="relative z-10">
            <div className="badge-chip mb-6">
              <Sparkles size={14} />
              Join the campus creator network
            </div>

            <h1 className="font-display text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
              Create one account, then move from ideas to shipped work faster.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/80">
              Register once to post tasks, apply for gigs, manage applicants, and keep communication connected to real project work.
            </p>

            <div className="mt-10 space-y-4">
              {[
                'Post budget-backed campus tasks in minutes',
                'Apply to opportunities without long intake forms',
                'Manage applicants and assignments in one workflow',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[1.3rem] border border-white/10 bg-white/10 px-4 py-4 text-white/85 backdrop-blur-xl">
                  <div className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  <span className="text-sm leading-6">{item}</span>
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
            <p className="section-kicker">Create account</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">Get started with ZYLO</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-[var(--brand-600)] hover:text-[var(--brand-700)]">
                Sign in here
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Full name</label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="name"
                  className="input-shell pl-11"
                  placeholder="Aarav Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  className="input-shell pl-11"
                  placeholder="you@campus.edu"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  className="input-shell pl-11 pr-11"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
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

            <p className="rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-400">
              This refresh focuses on a cleaner frontend experience, so your existing registration flow stays exactly where it belongs.
            </p>

            <button type="submit" disabled={isLoading} className="btn-dark w-full px-5 py-3.5">
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin" size={18} />
                  Creating account
                </>
              ) : (
                <>
                  Create account
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

export default Register;
