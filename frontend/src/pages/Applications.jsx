import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, LoaderCircle, UserRound } from 'lucide-react';
import { toast } from 'react-toastify';

import { assignTask, getTaskApplications } from '../services/api';

const Applications = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getTaskApplications(taskId);
        setApplications(response.data);
      } catch (_error) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [taskId]);

  const handleAssign = async (userId) => {
    setAssigningId(userId);
    try {
      await assignTask(taskId, { user_id: userId });
      toast.success('Freelancer assigned');
      navigate('/my-tasks');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to assign freelancer');
    } finally {
      setAssigningId(null);
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <div className="section-shell flex min-h-[70vh] items-center justify-center py-8">
          <div className="surface-card flex min-h-[220px] w-full max-w-2xl flex-col items-center justify-center">
            <LoaderCircle className="animate-spin text-[var(--brand-600)]" size={28} />
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">Loading applicants</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="section-shell py-8 sm:py-10">
        <button type="button" onClick={() => navigate('/my-tasks')} className="btn-secondary px-4 py-2.5">
          <ArrowLeft size={16} />
          Back
        </button>

        <section className="mt-6 surface-card">
          <p className="section-kicker">Applications</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
            Pick the right person.
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Review, assign, move on.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          {applications.length > 0 ? (
            applications.map((application, index) => (
              <motion.article
                key={application.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
                className="surface-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#111827,#2563eb)] text-lg font-semibold text-white">
                    {String(application.user_id).slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                      Applicant #{application.user_id}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ready to assign</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:items-end">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                    <UserRound size={16} />
                    Pending
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAssign(application.user_id)}
                    disabled={assigningId === application.user_id}
                    className="btn-primary px-5 py-3"
                  >
                    {assigningId === application.user_id ? (
                      <>
                        <LoaderCircle className="animate-spin" size={18} />
                        Assigning
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Assign
                      </>
                    )}
                  </button>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="surface-card text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <UserRound size={22} />
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">No applications yet</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">They will appear here as soon as people apply.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Applications;
