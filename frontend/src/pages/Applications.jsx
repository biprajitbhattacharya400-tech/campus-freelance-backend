import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskApplications, assignTask } from '../services/api';
import { toast } from 'react-toastify';
import { User, CheckCircle, ArrowLeft, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Applications = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [taskId]);

  const fetchApplications = async () => {
    try {
      const response = await getTaskApplications(taskId);
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (userId) => {
    setAssigningId(userId);
    try {
      await assignTask(taskId, { user_id: userId });
      toast.success('Freelancer assigned successfully!');
      navigate('/my-tasks');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to assign freelancer');
    } finally {
      setAssigningId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button 
        onClick={() => navigate('/my-tasks')}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to My Tasks
      </button>

      <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Task Applications</h1>
        <p className="text-gray-500 mt-1">Review applicants and select the best fit for your task.</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <User className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="text-gray-500 mt-1">Check back later for new applicants.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app, index) => (
            <motion.div 
              key={app.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                  {app.user_id}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Applicant User ID: {app.user_id}</h3>
                  <p className="text-sm text-gray-500">Applied recently</p>
                </div>
              </div>
              
              <button
                onClick={() => handleAssign(app.user_id)}
                disabled={assigningId === app.user_id}
                className="w-full sm:w-auto btn-primary flex justify-center items-center gap-2"
              >
                {assigningId === app.user_id ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Assign to Task
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
