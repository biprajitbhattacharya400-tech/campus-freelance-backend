import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { removeToken } from '../utils/auth';
import { Briefcase, LogOut, PlusCircle, LayoutDashboard, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    removeToken();
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300 shadow-sm border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gradient-to-br from-primary-500 to-blue-600 text-white p-3 rounded-xl shadow-lg shadow-primary-500/30"
              >
                <Briefcase size={26} className="stroke-[2.5]" />
              </motion.div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
                Campus<span className="text-gradient hover:opacity-80 transition-opacity">Lancer</span>
              </span>
            </Link>
            
            <div className="hidden md:flex md:space-x-6 items-center h-full pt-1">
              {[
                { name: 'Explore Tasks', path: '/dashboard', icon: LayoutDashboard },
                { name: 'My Tasks', path: '/my-tasks', icon: LayoutList }
              ].map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`relative flex items-center gap-2 py-2 text-base font-bold transition-all duration-300 group ${
                      isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? "text-primary-500" : "text-gray-400 group-hover:text-primary-500 transition-colors"} />
                    {item.name}
                    
                    <motion.div 
                      className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/create-task">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(34, 197, 94, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="btn-premium px-6 py-2.5 text-base font-bold"
              >
                <PlusCircle size={20} />
                <span className="hidden sm:inline">Post Task</span>
              </motion.button>
            </Link>
            
            <div className="relative group ml-1 cursor-pointer">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-gray-200 py-1.5 px-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-500 to-blue-500 text-white shadow-inner font-extrabold text-base border-2 border-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-gray-700 text-sm hidden sm:block pr-2">{user.name}</span>
              </motion.div>
              
              <div className="absolute right-0 top-[110%] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:scale-100 scale-95 shadow-2xl">
                <div className="w-56 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl overflow-hidden p-2">
                  <div className="px-4 py-3 border-b border-gray-50 mb-2 bg-gray-50/50 rounded-xl">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate font-medium mt-0.5">{user.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
