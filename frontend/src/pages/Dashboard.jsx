import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, Clock3, IndianRupee, LayoutGrid, PlusCircle, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

import { AuthContext } from '../context/AuthContext';
import { applyForTask, getTasks } from '../services/api';
import { formatCurrencyInr } from '../utils/format';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data);
      } catch (_error) {
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleApply = async (taskId) => {
    setApplyingId(taskId);
    try {
      await applyForTask({ task_id: taskId });
      toast.success('Application submitted');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to apply');
    } finally {
      setApplyingId(null);
    }
  };

  const openTasks = useMemo(() => tasks.filter((task) => task.status === 'open'), [tasks]);
  const myTasks = useMemo(() => tasks.filter((task) => task.owner_id === user?.id), [tasks, user]);
  const totalBudget = useMemo(() => openTasks.reduce((sum, task) => sum + Number(task.budget || 0), 0), [openTasks]);
  const featuredTasks = useMemo(
    () => [...openTasks].sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0)).slice(0, 6),
    [openTasks],
  );

  const stats = [
    { label: 'Open', value: openTasks.length, icon: LayoutGrid },
    { label: 'Budget live', value: formatCurrencyInr(totalBudget), icon: IndianRupee },
    { label: 'Your tasks', value: myTasks.length, icon: BriefcaseBusiness },
  ];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="section-shell py-8 sm:py-10">
          <div className="app-hero-card skeleton-block min-h-[220px]" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="metric-tile">
                <div className="skeleton-block h-11 w-11 rounded-2xl" />
                <div className="space-y-3">
                  <div className="skeleton-block h-3 w-20 rounded-full" />
                  <div className="skeleton-block h-8 w-28 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="section-shell py-8 sm:py-10">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="app-hero-card"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div>
              <div className="badge-chip">
                <Sparkles size={14} />
                Workspace
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Welcome back, {user?.name?.split(' ')[0] || 'there'}.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Open work, clear budgets, quick actions.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {user?.is_client ? (
                  <Link to="/create-task" className="btn-primary-on-dark px-6 py-3.5">
                    <PlusCircle size={18} />
                    New task
                  </Link>
                ) : null}
                <Link to="/my-tasks" className="btn-secondary-on-dark px-6 py-3.5">
                  {user?.is_client ? 'Manage tasks' : 'Your activity'}
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[22px] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white/75">{stat.label}</span>
                    <stat.icon size={16} className="text-cyan-200" />
                  </div>
                  <div className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Marketplace</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-4xl">
              Active tasks
            </h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">
            {featuredTasks.length} live
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featuredTasks.length > 0 ? (
            featuredTasks.map((task, index) => {
              const isOwner = task.owner_id === user?.id;
              const lacksFreelancerRole = !user?.is_freelancer;
              const isUnavailable = task.status !== 'open' || isOwner || lacksFreelancerRole;

              return (
                <motion.article
                  key={task.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.25 }}
                  className="dashboard-card flex min-h-[250px] flex-col"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
                      {task.status}
                    </span>
                    <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-sm font-semibold text-[var(--brand-700)]">
                      {formatCurrencyInr(task.budget)}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">{task.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {task.description?.length > 132 ? `${task.description.slice(0, 132)}...` : task.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <Clock3 size={15} />
                      Open now
                    </div>
                    <div>Owner #{task.owner_id}</div>
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{ scale: isUnavailable ? 1 : 0.97 }}
                    onClick={() => handleApply(task.id)}
                    disabled={isUnavailable || applyingId === task.id}
                    title={lacksFreelancerRole ? 'Enable the freelancer role from your profile to apply for tasks.' : undefined}
                    className={`mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                      isUnavailable || applyingId === task.id
                        ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-slate-900 dark:text-slate-500'
                        : 'border border-slate-950 bg-slate-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.14)] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105 hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)] active:scale-[0.97]'
                    }`}
                  >
                    {applyingId === task.id
                      ? 'Applying...'
                      : isOwner
                        ? 'Your task'
                        : lacksFreelancerRole
                          ? 'Switch to Freelancer to apply'
                          : task.status !== 'open'
                            ? 'Unavailable'
                            : 'Apply'}
                    {!isUnavailable && applyingId !== task.id ? <ArrowRight size={16} /> : null}
                  </motion.button>

                  {lacksFreelancerRole ? (
                    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      Open your profile and switch on Work (Freelancer) to apply.
                    </div>
                  ) : null}
                </motion.article>
              );
            })
          ) : (
            <div className="surface-card sm:col-span-2 xl:col-span-3">
              <p className="section-kicker">No tasks yet</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">Start the board.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">Post the first task and the marketplace becomes useful immediately.</p>
              <Link to="/create-task" className="btn-primary mt-6 px-5 py-3">
                <PlusCircle size={18} />
                Create task
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
