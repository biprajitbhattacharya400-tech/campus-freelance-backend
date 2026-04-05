import React, { useContext } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthContext } from './context/AuthContext';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import MyTasks from './pages/MyTasks';
import Applications from './pages/Applications';
import Chat from './pages/Chat';

const BackgroundDecorators = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#fdfefe_0%,#f7f9fc_44%,#f3f6fa_100%)] dark:bg-[linear-gradient(180deg,#0b0f19_0%,#0d1220_48%,#111827_100%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_8%,rgba(96,165,250,0.18),transparent_24%),radial-gradient(circle_at_14%_92%,rgba(56,189,248,0.14),transparent_24%),radial-gradient(circle_at_52%_36%,rgba(255,255,255,0.7),transparent_28%)] dark:bg-[radial-gradient(circle_at_88%_10%,rgba(93,121,209,0.18),transparent_28%),radial-gradient(circle_at_12%_92%,rgba(17,24,39,0.42),transparent_24%),radial-gradient(circle_at_48%_40%,rgba(17,24,39,0.24),transparent_34%)]" />
    <div className="absolute left-[-8rem] top-[-7rem] h-[24rem] w-[24rem] rounded-full bg-sky-200/[0.14] blur-[120px] dark:bg-sky-500/[0.08]" />
    <div className="absolute right-[-10rem] top-[2rem] h-[26rem] w-[26rem] rounded-full bg-indigo-200/[0.14] blur-[130px] dark:bg-indigo-500/[0.12]" />
    <div className="absolute bottom-[-9rem] left-[18%] h-[22rem] w-[22rem] rounded-full bg-blue-100/[0.18] blur-[120px] dark:bg-slate-900/50" />
    <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,rgba(255,255,255,0.56),transparent)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
    <div className="noise-mask absolute inset-0 opacity-20 dark:opacity-[0.08]" />
  </div>
);

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <BackgroundDecorators />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-task"
                  element={
                    <ProtectedRoute>
                      <CreateTask />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-tasks"
                  element={
                    <ProtectedRoute>
                      <MyTasks />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications/:taskId"
                  element={
                    <ProtectedRoute>
                      <Applications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/:taskId"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme={theme === 'dark' ? 'dark' : 'colored'} />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
