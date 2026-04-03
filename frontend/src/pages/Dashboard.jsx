import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, applyForTask } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { DollarSign, User, CheckCircle, PlusCircle, Search, Rocket, Briefcase, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (taskId) => {
    setApplyingId(taskId);
    try {
      await applyForTask({ task_id: taskId });
      toast.success('Successfully applied for the task!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to apply');
    } finally {
      setApplyingId(null);
    }
  };

  const statusColors = {
    open: 'bg-green-100 text-green-700 border border-green-300 font-bold',
    assigned: 'bg-purple-100 text-purple-700 border border-purple-300 font-bold',
    completed: 'bg-gray-100 text-gray-700 border border-gray-300 font-bold'
  };

  // Dashboard Stats
  const StatsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {[
        { title: 'Total Tasks', value: tasks.length || '0', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100', border: 'hover:border-blue-300' },
        { title: 'Active Gigs', value: tasks.filter(t => t.status === 'open').length || '0', icon: Rocket, color: 'text-green-500', bg: 'bg-green-100', border: 'hover:border-green-300' },
        { title: 'Completed', value: tasks.filter(t => t.status === 'completed').length || '0', icon: Star, color: 'text-purple-500', bg: 'bg-purple-100', border: 'hover:border-purple-300' }
      ].map((stat, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: i * 0.15, type: 'spring' }}
          whileHover={{ scale: 1.05, y: -5 }}
          className={`glass-card p-8 flex items-center gap-6 border-2 border-transparent transition-all duration-300 shadow-lg ${stat.border}`}
        >
          <div className={`p-4 rounded-3xl ${stat.bg} ${stat.color} shadow-inner`}>
            <stat.icon size={36} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-base font-bold text-gray-500 tracking-wide uppercase">{stat.title}</p>
            <h3 className="text-4xl font-black text-gray-900 mt-1">{stat.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="shimmer-box h-12 w-3/4 max-w-lg rounded-2xl mb-6"></div>
          <div className="shimmer-box h-6 w-1/2 max-w-sm rounded-xl"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-8 flex items-center gap-6 border-2 border-transparent shadow-sm">
              <div className="shimmer-box h-16 w-16 rounded-3xl"></div>
              <div className="flex-1 space-y-3">
                <div className="shimmer-box h-4 w-2/3 rounded-md"></div>
                <div className="shimmer-box h-10 w-1/2 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-8 rounded-3xl h-72 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="shimmer-box h-6 w-20 rounded-full"></div>
                <div className="shimmer-box h-8 w-24 rounded-xl"></div>
              </div>
              <div className="shimmer-box h-8 w-3/4 rounded-lg mb-4"></div>
              <div className="shimmer-box h-4 w-full rounded-md mb-2"></div>
              <div className="shimmer-box h-4 w-5/6 rounded-md mb-8"></div>
              <div className="mt-auto">
                <div className="shimmer-box h-12 w-full rounded-2xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <motion.div 
        initial={{ opacity: 0, x: -30 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.5, type: 'spring' }}
        className="mb-12"
      >
        <h1 className="text-5xl font-black text-gray-900 tracking-tight drop-shadow-sm">
          Welcome back, <span className="text-gradient hover:scale-105 inline-block transition-transform cursor-default">{user.name.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-gray-500 mt-4 text-xl font-medium">Explore fresh opportunities in the campus marketplace today.</p>
      </motion.div>

      <StatsSection />

      <div className="flex justify-between items-center mb-8 border-b-2 border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <motion.div 
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <Search size={28} className="text-primary-500 stroke-[3]" />
          </motion.div>
          Opportunity Board
        </h2>
      </div>

      <AnimatePresence>
        {tasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-32 bg-white/60 backdrop-blur-2xl rounded-[3rem] border border-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/50 rounded-full blur-3xl mix-blend-multiply opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/50 rounded-full blur-3xl mix-blend-multiply opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="mx-auto w-32 h-32 bg-gradient-to-br from-primary-100 to-blue-100 rounded-full flex items-center justify-center mb-8 shadow-inner shadow-blue-200/50 border border-white"
            >
              <Rocket className="text-primary-600" size={56} strokeWidth={1.5} />
            </motion.div>
            
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4 drop-shadow-sm">No tasks yet 🚀 Let's get things started!</h3>
            <p className="text-gray-500 max-w-lg mx-auto mb-10 text-xl font-medium leading-relaxed">
              The marketplace is your blank canvas. Be the pioneer and launch the very first project!
            </p>
            <Link to="/create-task">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(34, 197, 94, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="btn-premium px-10 py-5 text-lg font-bold rounded-2xl shadow-xl border-b-4 border-primary-700"
              >
                <PlusCircle size={24} />
                Post Your First Task
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {tasks.map((task, index) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.03, y: -10 }}
                className="glass-card flex flex-col h-full bg-white/90 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 border border-gray-100 group p-8 rounded-3xl cursor-default"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-sm ${statusColors[task.status] || 'bg-gray-100'}`}>
                    {task.status}
                  </span>
                  <span className="flex items-center text-gray-900 font-black text-2xl drop-shadow-sm bg-green-50 px-3 py-1 rounded-xl border border-green-100 group-hover:bg-green-100 transition-colors">
                    <DollarSign size={24} className="text-green-600 mr-1 stroke-[3]" />
                    {task.budget}
                  </span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-gray-900 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors">{task.title}</h3>
                <p className="text-gray-500 mb-8 line-clamp-3 text-base font-medium leading-relaxed flex-grow">
                  {task.description}
                </p>
                
                <div className="mt-auto pt-6 border-t-2 border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6 font-bold">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                      <User size={16} className="text-gray-600 stroke-[2.5]" />
                      <span>Client {task.owner_id}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="stroke-[2.5]" />
                      <span>New</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={task.status === 'open' && task.owner_id !== user.id && !applyingId ? { scale: 1.05 } : {}}
                    whileTap={task.status === 'open' && task.owner_id !== user.id && !applyingId ? { scale: 0.95 } : {}}
                    onClick={() => handleApply(task.id)}
                    disabled={task.status !== 'open' || task.owner_id === user.id || applyingId === task.id}
                    className={`w-full py-4 rounded-2xl flex justify-center items-center gap-2 font-extrabold text-lg transition-all duration-300 ${
                      applyingId === task.id ? 'bg-primary-500 text-white cursor-wait opacity-80'
                      : task.owner_id === user.id ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                      : task.status !== 'open' ? 'bg-gray-50 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-600 directly to-green-500 text-white shadow-lg hover:shadow-xl hover:shadow-primary-500/30'
                    }`}
                  >
                    {applyingId === task.id ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-white"></div>
                    ) : task.owner_id === user.id ? (
                      'Your Gig'
                    ) : task.status !== 'open' ? (
                      'Unavailable'
                    ) : (
                      'Apply for Gig'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
