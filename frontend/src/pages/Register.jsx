import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { toast } from 'react-toastify';
import { Briefcase, ArrowRight, Loader, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
      return;
    }
    
    setIsLoading(true);
    try {
      await registerUser(formData);
      toast.success('Registration successful! Welcome aboard.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to register');
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-[10%] right-[10%] w-[30rem] h-[30rem] bg-primary-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[30rem] h-[30rem] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>

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
            whileHover={{ rotate: -180, scale: 1.1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mx-auto h-20 w-20 bg-gradient-to-tr from-green-500 to-primary-700 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-primary-500/30"
          >
            <Briefcase size={40} strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            Join Platform
          </h2>
          <p className="mt-3 text-base font-medium text-gray-500">
            Already have an account? {' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500 hover:underline transition-all">
              Sign in securely
            </Link>
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="floating-group relative">
            <User className={`absolute left-4 top-[1.25rem] z-10 transition-colors duration-300 ${isError && !formData.name ? 'text-red-500' : 'text-gray-400'}`} size={22} />
            <input
              type="text"
              name="name"
              required
              className={`floating-input pl-[3.25rem] ${isError && !formData.name ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 ring-2 ring-red-100' : ''}`}
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
            />
            <label className={`floating-label pl-10 ${isError && !formData.name ? 'text-red-500' : ''}`}>Full Name</label>
          </div>

          <div className="floating-group relative">
            <Mail className={`absolute left-4 top-[1.25rem] z-10 transition-colors duration-300 ${isError && !formData.email ? 'text-red-500' : 'text-gray-400'}`} size={22} />
            <input
              type="email"
              name="email"
              required
              className={`floating-input pl-[3.25rem] ${isError && !formData.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 ring-2 ring-red-100' : ''}`}
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
            />
            <label className={`floating-label pl-10 ${isError && !formData.email ? 'text-red-500' : ''}`}>University Email</label>
          </div>
          
          <div className="floating-group relative">
            <Lock className={`absolute left-4 top-[1.25rem] z-10 transition-colors duration-300 ${isError && !formData.password ? 'text-red-500' : 'text-gray-400'}`} size={22} />
            <input
              type="password"
              name="password"
              required
              className={`floating-input pl-[3.25rem] ${isError && !formData.password ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 ring-2 ring-red-100' : ''}`}
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
            />
            <label className={`floating-label pl-10 ${isError && !formData.password ? 'text-red-500' : ''}`}>Create Password</label>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(34, 197, 94, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className={`w-full btn-premium py-4 mt-6 text-lg font-bold shadow-xl transition-all duration-300 ${isError ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-500/30' : ''}`}
          >
            {isLoading ? (
              <Loader className="animate-spin" size={24} />
            ) : (
              <span className="flex items-center justify-center gap-2 w-full">
                Create Account <ArrowRight size={20} className="stroke-[2.5]" />
              </span>
            )}
          </motion.button>
          
          <p className="text-sm font-medium text-center text-gray-400 mt-8">
            By registering, you agree to our Terms of Service & Privacy Policy.
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
