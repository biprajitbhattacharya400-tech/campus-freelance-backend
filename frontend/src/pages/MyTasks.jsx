import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquareText, PlusCircle, UsersRound } from 'lucide-react';
import { toast } from 'react-toastify';

import { AuthContext } from '../context/AuthContext';
import { getTasks } from '../services/api';
import { formatCurrencyInr } from '../utils/format';

const MyTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data.filter((task) => task.owner_id === user?.id));
      } catch (_error) {
        toast.error('Failed to load your tasks');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchMyTasks();
    }
  }, [user]);

  const summary = useMemo(
    () => ({
      total: tasks.length,
      open: tasks.filter((task) => task.status === 'open').length,
      assigned: tasks.filter((task) => task.status === 'assigned').length,
    }),
    [tasks],
  );

  if (loading) {
    return (
      <div className="page-shell">
        <div className="section-shell py-8 sm:py-10">
          <div className="surface-card skeleton-block min-h-[220px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="section-shell py-8 sm:py-10">
        <section className="app-hero-card">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <p className="section-kicker text-white/70">Your tasks</p>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                Everything you posted, in one place.
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/80 sm:text-base">
                Track open work, assignments, and next actions.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ['Total', summary.total],
                ['Open', summary.open],
                ['Assigned', summary.assigned],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[22px] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-xl">
                  <div className="text-sm text-white/75">{label}</div>
                  <div className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Owner view</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-4xl">
              Posted tasks
            </h2>
          </div>
          {user?.is_client ? (
            <Link to="/create-task" className="btn-primary px-5 py-3">
              <PlusCircle size={18} />
              New task
            </Link>
          ) : null}
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <motion.article
                key={task.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
                className="surface-card flex h-full flex-col"
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
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {task.description?.length > 150 ? `${task.description.slice(0, 150)}...` : task.description}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link to={`/applications/${task.id}`} className="btn-primary px-5 py-3">
                    <UsersRound size={18} />
                    Applicants
                  </Link>
                  {task.status === 'assigned' && (
                    <Link to={`/chat/${task.id}`} className="btn-secondary px-5 py-3">
                      <MessageSquareText size={18} />
                      Chat
                    </Link>
                  )}
                </div>
              </motion.article>
            ))
          ) : (
            <div className="surface-card xl:col-span-2">
              <p className="section-kicker">No tasks yet</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">Start with one brief.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {user?.is_client
                  ? 'Post the first task and this workspace becomes your control center.'
                  : 'Enable the client role in your profile when you want to start hiring.'}
              </p>
              {user?.is_client ? (
                <Link to="/create-task" className="btn-primary mt-6 px-5 py-3">
                  <ArrowRight size={18} />
                  Create task
                </Link>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyTasks;
