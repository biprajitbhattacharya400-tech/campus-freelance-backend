import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getTasks } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { DollarSign, Clock, Users, ClipboardList, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchMyTasks();
  }, [user]);

  const fetchMyTasks = async () => {
    try {
      const response = await getTasks();
      const myOwnedTasks = response.data.filter(task => task.owner_id === user.id);
      setTasks(myOwnedTasks);
    } catch (error) {
      toast.error('Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    open: 'bg-green-100 text-green-700 border border-green-300 font-bold',
    assigned: 'bg-purple-100 text-purple-700 border border-purple-300 font-bold',
    completed: 'bg-gray-100 text-gray-700 border border-gray-300 font-bold'
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 border-b-2 border-gray-100 pb-6">
          <div className="shimmer-box h-12 w-3/4 max-w-lg rounded-2xl mb-4"></div>
          <div className="shimmer-box h-6 w-1/2 max-w-sm rounded-xl"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-8 rounded-3xl h-60 flex gap-6">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="shimmer-box h-6 w-20 rounded-full"></div>
                  <div className="shimmer-box h-8 w-24 rounded-xl"></div>
                </div>
                <div className="shimmer-box h-8 w-3/4 rounded-lg mb-4"></div>
                <div className="shimmer-box h-4 w-full rounded-md mb-2"></div>
                <div className="shimmer-box h-4 w-5/6 rounded-md"></div>
              </div>
              <div className="w-1/3 flex flex-col justify-center gap-4 pl-6 border-l-2 border-gray-100">
                <div className="shimmer-box h-14 w-full rounded-2xl"></div>
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
        className="mb-12 border-b-2 border-gray-100 pb-6"
      >
        <h1 className="text-5xl font-black text-gray-900 tracking-tight drop-shadow-sm">Your Posted Tasks</h1>
        <p className="text-gray-500 mt-4 text-xl font-medium">Manage applicants and track the progress of your gigs.</p>
      </motion.div>

      <AnimatePresence>
        {tasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-32 bg-white/60 backdrop-blur-2xl rounded-[3rem] border border-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-200/50 rounded-full blur-3xl mix-blend-multiply opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-200/50 rounded-full blur-3xl mix-blend-multiply opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="mx-auto w-32 h-32 bg-gradient-to-br from-primary-100 to-blue-100 rounded-full flex items-center justify-center mb-8 shadow-inner shadow-blue-200/50 border border-white"
            >
              <ClipboardList className="text-primary-600" size={56} strokeWidth={1.5} />
            </motion.div>
            
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4 drop-shadow-sm">No tasks posted yet</h3>
            <p className="text-gray-500 max-w-lg mx-auto mb-10 text-xl font-medium leading-relaxed">
              Looking to get something done? Post a gig and let talented campus freelancers help you out!
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
            {tasks.map((task, index) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card flex flex-col md:flex-row bg-white/90 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl border border-gray-100 group p-8 rounded-3xl gap-8"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-5">
                    <span className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-sm ${statusColors[task.status] || 'bg-gray-100'}`}>
                      {task.status}
                    </span>
                    <span className="flex items-center text-gray-900 font-black text-2xl drop-shadow-sm bg-green-50 px-3 py-1 rounded-xl border border-green-100">
                      <DollarSign size={24} className="text-green-600 mr-1 stroke-[3]" />
                      {task.budget}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{task.title}</h3>
                  <p className="text-gray-500 text-base font-medium line-clamp-3 leading-relaxed mb-6">{task.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-bold">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                      <Clock size={16} className="text-gray-600 stroke-[2.5]" />
                      <span>Posted recently</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center gap-4 pt-6 border-t md:border-t-0 md:border-l-2 border-gray-100 md:pl-8 min-w-[220px]">
                  <Link to={`/applications/${task.id}`}>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      className="w-full btn-premium py-4 rounded-2xl flex justify-center items-center gap-2 font-extrabold text-lg shadow-lg"
                    >
                      <Users size={20} />
                      Applicant Hub
                    </motion.button>
                  </Link>
                  
                  {task.status === 'assigned' && (
                    <Link to={`/chat/${task.id}`}>
                      <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.2)" }} 
                        whileTap={{ scale: 0.95 }}
                        className="w-full btn-secondary py-4 rounded-2xl border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-extrabold text-lg transition-all"
                      >
                        Workspace Chat
                      </motion.button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyTasks;
