import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, getUserMe } from '../services/api';
import { setToken } from '../utils/auth';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Briefcase, ArrowRight, Loader, Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      setToken(response.data.access_token);
      
      const userRes = await getUserMe();
      setUser(userRes.data);
      
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to login');
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-primary-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[30rem] h-[30rem] bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob" style={{ animationDelay: '4s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ 
          opacity: 1, y: 0, scale: 1,
          x: isError ? [-10, 10, -10, 10, 0] : 0 
        }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="max-w-md w-full glass-card p-10 relative z-10 border-2 border-white/60 shadow-2xl"
      >
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mx-auto h-20 w-20 bg-gradient-to-tr from-primary-600 to-blue-500 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-primary-500/30"
          >
            <Briefcase size={40} strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-3 text-base text-gray-500 font-medium">
            Don't have an account? {' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500 hover:underline transition-all">
              Sign up for free
            </Link>
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="floating-group relative">
            <Mail className={`absolute left-4 top-[1.25rem] z-10 transition-colors duration-300 ${isError ? 'text-red-500' : 'text-gray-400'}`} size={22} />
            <input
              type="email"
              required
              className={`floating-input pl-[3.25rem] ${isError ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 ring-2 ring-red-100' : ''}`}
              placeholder=" "
              value={email}
              onChange={(e) => { setEmail(e.target.value); setIsError(false); }}
            />
            <label className={`floating-label pl-10 ${isError ? 'text-red-500' : ''}`}>Email Address</label>
          </div>
          
          <div className="floating-group relative">
            <Lock className={`absolute left-4 top-[1.25rem] z-10 transition-colors duration-300 ${isError ? 'text-red-500' : 'text-gray-400'}`} size={22} />
            <input
              type="password"
              required
              className={`floating-input pl-[3.25rem] ${isError ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 ring-2 ring-red-100' : ''}`}
              placeholder=" "
              value={password}
              onChange={(e) => { setPassword(e.target.value); setIsError(false); }}
            />
            <label className={`floating-label pl-10 ${isError ? 'text-red-500' : ''}`}>Password</label>
          </div>

          <div className="flex items-center justify-between mt-2 mb-8">
            <div className="flex items-center group cursor-pointer">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer transition-colors" />
              <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer group-hover:text-gray-900 transition-colors">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-bold text-primary-600 hover:text-primary-500 hover:underline transition-all">Forgot password?</a>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(34, 197, 94, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className={`w-full btn-premium py-4 text-lg font-bold shadow-xl transition-all duration-300 ${isError ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-500/30' : ''}`}
          >
            {isLoading ? (
              <Loader className="animate-spin" size={24} />
            ) : (
              <span className="flex items-center justify-center gap-2 w-full">
                Sign In to Platform <ArrowRight size={20} className="stroke-[2.5]" />
              </span>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
