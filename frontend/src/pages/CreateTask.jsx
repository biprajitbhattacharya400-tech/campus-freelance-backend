import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BriefcaseBusiness, IndianRupee, LoaderCircle, PenSquare, Send, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

import { AuthContext } from '../context/AuthContext';
import { createTask } from '../services/api';

const CreateTask = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.is_client) {
      toast.error('Enable the client role to create tasks');
      return;
    }

    if (!formData.title || !formData.description || !formData.budget) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await createTask({
        ...formData,
        budget: parseFloat(formData.budget),
      });
      toast.success('Task created');
      navigate('/dashboard');
    } catch (_error) {
      toast.error('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="section-shell py-8 sm:py-10">
        <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary px-4 py-2.5">
          <ArrowLeft size={16} />
          Back
        </button>

        {!user?.is_client ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="surface-card mt-6"
          >
            <p className="section-kicker">Client role required</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
              Turn on hiring before posting work.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              Open your profile from the navbar and enable "I want to hire" to create tasks on ZYLO.
            </p>
          </motion.section>
        ) : null}

        <div className={`mt-6 grid gap-5 lg:grid-cols-[1fr_360px] ${!user?.is_client ? 'pointer-events-none opacity-45' : ''}`}>
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="surface-card"
          >
            <p className="section-kicker">Create task</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
              Post a clean brief.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              Clear title. Clear scope. Clear budget.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="field-label">Title</label>
                <div className="relative">
                  <BriefcaseBusiness className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    name="title"
                    className="input-shell pl-11"
                    placeholder="Landing page redesign"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Scope</label>
                <div className="relative">
                  <PenSquare className="pointer-events-none absolute left-4 top-5 text-slate-400" size={18} />
                  <textarea
                    name="description"
                    className="textarea-shell pl-11"
                    placeholder="What needs to be done, deadline, and output."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Budget</label>
                <div className="relative">
                  <IndianRupee className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="number"
                    name="budget"
                    min="1"
                    step="0.01"
                    className="input-shell pl-11"
                    placeholder="150"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-white/10 sm:flex-row">
                <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary px-5 py-3">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="btn-primary px-5 py-3">
                  {isLoading ? (
                    <>
                      <LoaderCircle className="animate-spin" size={18} />
                      Publishing
                    </>
                  ) : (
                    <>
                      Publish
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 }}
            className="surface-card"
          >
            <div className="badge-chip">
              <Sparkles size={14} />
              Better brief
            </div>
            <div className="mt-6 space-y-3">
              {[
                'Lead with the outcome',
                'Keep scope concrete',
                'Use a real budget',
              ].map((item) => (
                <div key={item} className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[22px] bg-slate-950 px-5 py-5 text-white">
              <div className="text-xs uppercase tracking-[0.22em] text-white/65">Example</div>
              <p className="mt-3 text-sm leading-6 text-white/85">
                Need a mobile-first landing page refresh. Delivery in 5 days. Budget: ₹180.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;

