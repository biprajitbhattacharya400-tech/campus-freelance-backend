import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, LoaderCircle, Send } from 'lucide-react';
import { toast } from 'react-toastify';

import { AuthContext } from '../context/AuthContext';
import { getTaskMessages, sendMessage } from '../services/api';

const timeFormatter = new Intl.DateTimeFormat([], {
  hour: '2-digit',
  minute: '2-digit',
});

const Chat = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await getTaskMessages(taskId);
      setMessages(response.data);
    } catch (_error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchMessages();
    const interval = window.setInterval(fetchMessages, 5000);
    return () => window.clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await sendMessage({
        task_id: parseInt(taskId, 10),
        message: newMessage.trim(),
      });
      setNewMessage('');
      await fetchMessages();
    } catch (_error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <div className="section-shell flex min-h-[70vh] items-center justify-center py-8">
          <div className="surface-card flex min-h-[220px] w-full max-w-2xl flex-col items-center justify-center">
            <LoaderCircle className="animate-spin text-[var(--brand-600)]" size={28} />
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">Opening chat</h2>
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

        <div className="mt-6 grid gap-5 lg:grid-cols-[300px_1fr]">
          <aside className="surface-card">
            <p className="section-kicker">Task chat</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">
              Stay in context.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Messages stay attached to task #{taskId}.
            </p>

            <div className="mt-6 space-y-3">
              {['Auto refresh', 'Shared thread', 'Clean handoff'].map((item) => (
                <div key={item} className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <section className="surface-card flex min-h-[70vh] flex-col p-0">
            <div className="border-b border-slate-200 px-5 py-5 dark:border-white/10 sm:px-6">
              <p className="section-kicker">Conversation</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">Shared workspace</h2>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/80 px-5 py-6 dark:bg-slate-950/30 sm:px-6">
              {messages.length > 0 ? (
                messages.map((message, index) => {
                  const isMine = message.sender_id === user?.id;

                  return (
                    <div key={`${message.sender_id}-${message.timestamp}-${index}`} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-[20px] px-4 py-3 shadow-sm ${
                          isMine ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-white'
                        }`}
                      >
                        {!isMine ? (
                          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                            User #{message.sender_id}
                          </div>
                        ) : null}
                        <p className="text-sm leading-6">{message.message}</p>
                        <div className={`mt-2 text-right text-[11px] ${isMine ? 'text-white/50' : 'text-slate-400'}`}>
                          {timeFormatter.format(new Date(message.timestamp))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex h-full min-h-[320px] items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
                  No messages yet.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="border-t border-slate-200 bg-white px-5 py-5 dark:border-white/10 dark:bg-slate-950/50 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <textarea
                  rows={2}
                  className="textarea-shell min-h-[90px] flex-1"
                  placeholder="Write a message"
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      handleSend(event);
                    }
                  }}
                />
                <button type="submit" disabled={sending || !newMessage.trim()} className="btn-primary px-5 py-3 sm:self-end">
                  {sending ? (
                    <>
                      <LoaderCircle className="animate-spin" size={18} />
                      Sending
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Chat;
