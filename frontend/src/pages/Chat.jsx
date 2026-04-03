import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskMessages, sendMessage } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Send, ArrowLeft, Loader } from 'lucide-react';

const Chat = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await getTaskMessages(taskId);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages');
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Auto refresh every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [taskId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      await sendMessage({
        task_id: parseInt(taskId),
        message: newMessage
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Loader className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => navigate('/my-tasks')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Chat</h1>
          <p className="text-sm text-gray-500">Communicate securely with your team</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-2xl border border-gray-200 border-b-0 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.sender_id === user.id;
              return (
                <div 
                  key={index} 
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[75%] px-4 py-2 ${
                      isMine 
                        ? 'bg-primary-600 text-white rounded-l-2xl rounded-tr-2xl' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-r-2xl rounded-tl-2xl'
                    } shadow-sm`}
                  >
                    {!isMine && (
                      <div className="text-xs text-gray-500 mb-1 font-medium">
                        User {msg.sender_id}
                      </div>
                    )}
                    <p className="text-sm sm:text-base break-words">{msg.message}</p>
                    <div className={`text-[10px] mt-1 text-right ${isMine ? 'text-primary-100' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form 
        onSubmit={handleSend}
        className="bg-white p-4 rounded-b-2xl border border-gray-200 shadow-sm flex items-end gap-2"
      >
        <textarea
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all max-h-32"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          {sending ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
};

export default Chat;
