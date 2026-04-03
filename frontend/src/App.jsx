import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import MyTasks from './pages/MyTasks';
import Applications from './pages/Applications';
import Chat from './pages/Chat';

// Global Animated Background Component
const BackgroundDecorators = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-gray-50/50 pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
    <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2s' }}></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '4s' }}></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col relative">
          <BackgroundDecorators />
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/create-task" element={
                  <ProtectedRoute>
                    <CreateTask />
                  </ProtectedRoute>
                } />
                <Route path="/my-tasks" element={
                  <ProtectedRoute>
                    <MyTasks />
                  </ProtectedRoute>
                } />
                <Route path="/applications/:taskId" element={
                  <ProtectedRoute>
                    <Applications />
                  </ProtectedRoute>
                } />
                <Route path="/chat/:taskId" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />
                
                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </Router>
    </AuthProvider>
  );
}

export default App;
