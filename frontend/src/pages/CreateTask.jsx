import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../services/api';
import { toast } from 'react-toastify';
import { Send, Loader, ArrowLeft, Briefcase, DollarSign, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.budget) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        budget: parseFloat(formData.budget)
      };
      await createTask(payload);
      toast.success('Task successfully created!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.button 
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-primary-600 font-medium mb-8 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-white p-8 sm:p-10"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Post a New Gig</h1>
          <p className="text-gray-500 mt-2 text-lg">Detail your request so freelancers can understand your needs.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Gig Title</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-[1.15rem] text-gray-400" size={20} />
              <input
                type="text"
                name="title"
                required
                className="input-field pl-11"
                placeholder="e.g. Need a logo designer for my campus club"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 pl-2">A clear, short title attracts the right talent.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Detailed Description</label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 text-gray-400" size={20} />
              <textarea
                name="description"
                required
                rows="5"
                className="input-field pl-11 py-4"
                placeholder="Describe what you need done, timelines, and specific requirements..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Project Budget ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-[1.15rem] text-gray-400" size={20} />
              <input
                type="number"
                name="budget"
                required
                min="1"
                step="0.01"
                className="input-field pl-11 font-mono"
                placeholder="50.00"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary px-6 py-3"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-premium px-8 py-3"
            >
              {isLoading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <span className="flex items-center gap-2">
                  Launch Task <Send size={18} />
                </span>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateTask;
