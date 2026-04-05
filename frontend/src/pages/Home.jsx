import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Command,
  Layers3,
  MessagesSquare,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import zyloSignature from '../assets/zylo-signature.svg';
import { formatCurrencyInr } from '../utils/format';

const highlights = ['Post in minutes', 'Assign faster', 'Chat in context'];

const featureCards = [
  {
    icon: BriefcaseBusiness,
    title: 'One clean board',
    copy: 'Tasks, budget, status.',
  },
  {
    icon: WandSparkles,
    title: 'Faster handoff',
    copy: 'Applicants to assignee in a few taps.',
  },
  {
    icon: MessagesSquare,
    title: 'Work stays attached',
    copy: 'Every message belongs to a task.',
  },
  {
    icon: Layers3,
    title: 'Built for campus teams',
    copy: 'Simple enough to adopt quickly.',
  },
];

const workflowSteps = [
  {
    number: '01',
    title: 'Post',
    copy: 'Write the task and set the budget.',
  },
  {
    number: '02',
    title: 'Pick',
    copy: 'Review applicants and choose one.',
  },
  {
    number: '03',
    title: 'Deliver',
    copy: 'Collaborate in the shared thread.',
  },
];

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="page-shell">
      <section className="section-shell pt-6 sm:pt-8 lg:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="hero-panel"
        >
          <img
            src={zyloSignature}
            alt=""
            aria-hidden="true"
            className="brand-logo pointer-events-none absolute right-6 top-6 hidden h-10 w-auto opacity-[0.06] sm:block dark:opacity-[0.09]"
          />
          <div className="hero-grid">
            <div className="max-w-[36rem]">
              <div className="badge-chip">
                <Sparkles size={14} />
                ZYLO for campus teams
              </div>

              <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
                The fastest way to post, assign, and ship campus work.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
                A calmer way to hire, apply, and deliver student work.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to={user ? '/dashboard' : '/register'} className="btn-primary px-6 py-3.5">
                  {user ? 'Open dashboard' : 'Start free'}
                  <ArrowRight size={18} />
                </Link>
                <Link to={user ? '/create-task' : '/login'} className="btn-secondary px-6 py-3.5">
                  {user ? 'Post a task' : 'Log in'}
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * index + 0.15, duration: 0.3 }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300"
                  >
                    <CheckCircle2 size={15} className="text-[var(--brand-600)]" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.55, ease: 'easeOut' }}
              className="preview-panel"
            >
              <div className="preview-window">
                <div className="preview-topbar">
                  <div className="preview-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
                    Live board
                  </div>
                </div>

                <div className="preview-surface">
                  <div className="grid gap-3 lg:grid-cols-[0.82fr_1.18fr]">
                    <div className="preview-sidebar">
                      <div className="preview-chip">
                        <Command size={14} />
                        Workspace
                      </div>
                      <div className="space-y-2.5">
                        <div className="preview-nav-item preview-nav-item-active">Overview</div>
                        <div className="preview-nav-item">Applications</div>
                        <div className="preview-nav-item">Messages</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900/70">
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Open tasks</div>
                        <div className="mt-2 font-display text-3xl font-semibold tracking-[-0.045em] text-slate-950 dark:text-white">24</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="preview-feature-card">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Featured task</div>
                          <div className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Demo day pitch deck</div>
                        </div>
                        <div className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-sm font-semibold text-[var(--brand-700)]">
                          {formatCurrencyInr(90)}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="preview-stat-card preview-stat-card-dark">
                          <div className="text-xs uppercase tracking-[0.22em] text-white/70">Response time</div>
                          <div className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-white">18 min</div>
                        </div>
                        <div className="preview-stat-card">
                          <div className="text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Applicants</div>
                          <div className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">12</div>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {[
                          ['Poster set for fest launch', formatCurrencyInr(120)],
                          ['Robotics site refresh', formatCurrencyInr(280)],
                          ['Club intro reel edit', formatCurrencyInr(75)],
                        ].map(([title, price]) => (
                          <div key={title} className="preview-list-item">
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">{title}</div>
                              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Open now</div>
                            </div>
                            <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
                              {price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="section-shell section-gap">
        <div className="section-heading">
          <p className="section-kicker">Product value</p>
          <h2 className="section-title">Built for speed, not clutter.</h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.06, duration: 0.28 }}
              className="feature-card"
            >
              <div className="feature-icon">
                <card.icon size={18} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{card.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="workflow" className="section-shell section-gap">
        <div className="workflow-shell">
          <div className="max-w-2xl">
            <p className="section-kicker">Workflow</p>
            <h2 className="section-title text-white">A simpler path from brief to delivery.</h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.07, duration: 0.3 }}
                className="workflow-step"
              >
                <div className="flex items-center justify-between">
                  <div className="workflow-number">{step.number}</div>
                  {index < workflowSteps.length - 1 && <ChevronRight size={18} className="hidden text-white/50 lg:block" />}
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.04em] text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/80">{step.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell section-gap pb-20 sm:pb-24">
        <div className="cta-panel">
          <div className="max-w-2xl">
            <p className="section-kicker text-white/70">Start here</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
              Product-grade UI. Less noise. Better momentum.
            </h2>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={user ? '/dashboard' : '/register'} className="btn-primary-on-dark px-6 py-3.5">
              {user ? 'Go to dashboard' : 'Create account'}
            </Link>
            <Link to={user ? '/create-task' : '/login'} className="btn-secondary-on-dark px-6 py-3.5">
              {user ? 'Launch a task' : 'Sign in'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
