import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LoaderCircle } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="mx-auto flex min-h-[70vh] max-w-[1540px] items-center justify-center px-5 sm:px-7 lg:px-8 xl:px-10">
          <div className="panel-dark flex min-h-[260px] w-full max-w-xl flex-col items-center justify-center text-center">
            <div className="mb-5 rounded-full border border-white/10 bg-white/10 p-4 text-cyan-200">
              <LoaderCircle className="animate-spin" size={28} />
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">Loading your workspace</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/80">
              We are checking your session and pulling the latest account context before opening the app.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
