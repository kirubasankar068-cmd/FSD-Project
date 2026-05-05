import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  Search, 
  Circle,
  Inbox,
  User,
  ShieldCheck,
  Zap,
  Bot,
  Bell,
  X,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import SafeImage from '../components/SafeImage';
import { apiMock } from '../services/apiMock';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';

export default function Messages() {
  const { notifications, setNotifications } = useAppContext();
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedNotif, setSelectedNotif] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      const data = await apiMock.getChatThreads();
      
      const systemThread = {
        _id: 'system',
        participant: 'JobGrox System',
        isSystem: true,
        isAI: false,
        time: notifications.length > 0 && notifications[0].createdAt ? format(new Date(notifications[0].createdAt), 'h:mm a') : 'Recent',
        lastMessage: notifications.length > 0 ? notifications[0].message : 'Welcome to JobGrox',
        unread: notifications.filter(n => !n.isRead).length
      };

      setThreads([systemThread, ...data]);
      if (!activeThread) setActiveThread(systemThread);
      setLoading(false);
    };
    fetchThreads();
  }, [notifications]);

  useEffect(() => {
    if (activeThread) {
      if (activeThread._id === 'system') {
        setChatLoading(true);
        const notifMsgs = notifications.map(n => ({
          _id: n._id || Math.random(),
          sender: 'System',
          text: n.message,
          time: n.createdAt ? format(new Date(n.createdAt), 'h:mm a') : 'Recent',
          fullContext: n
        }));
        setMessages(notifMsgs);
        setChatLoading(false);
      } else {
        const fetchHistory = async () => {
          setChatLoading(true);
          const history = await apiMock.getChatHistory(activeThread._id);
          setMessages(history);
          setChatLoading(false);
        };
        fetchHistory();
      }
    }
  }, [activeThread, notifications]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessage("");

    // Simple AI echoing for simulation
    if (activeThread?.isAI) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: 'AI',
          text: `Processing synchronization payload... Analyzing: "${newMessage}"`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-100px)] pt-16 pb-4">
        <div className="h-full bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden flex flex-row">
          
          {/* Left Panel: Thread List */}
          <div className="w-80 lg:w-96 border-r border-slate-50 flex flex-col bg-slate-50/30">
            <div className="p-8 border-b border-slate-50">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight italic flex items-center gap-3">
                Active <span className="text-[var(--primary)]">Nodes</span>
              </h2>
              <div className="mt-6 relative">
                 <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                  type="text" 
                  placeholder="Scan nodes..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                 />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 rounded-2xl animate-pulse flex gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 bg-slate-100 rounded-full"></div>
                      <div className="h-2 w-1/2 bg-slate-50 rounded-full"></div>
                    </div>
                  </div>
                ))
              ) : threads.map((thread) => (
                <div 
                  key={thread._id}
                  onClick={() => setActiveThread(thread)}
                  className={`p-4 rounded-[1.5rem] cursor-pointer transition-all flex items-center gap-4 group ${activeThread?._id === thread._id ? 'bg-white shadow-md border border-slate-100 ring-2 ring-[var(--primary-light)]' : 'hover:bg-white/60'}`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden shadow-sm bg-slate-100 flex items-center justify-center">
                      {thread.isSystem ? <Bell size={24} className="text-indigo-600" /> : thread.isAI ? <Bot size={24} className="text-[var(--primary)]" /> : (
                        <SafeImage 
                          src={thread.avatar} 
                          companyName={thread.participant}
                          className="w-full h-full object-contain p-2"
                        />
                      )}
                    </div>
                    {thread.status === 'online' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="text-sm font-black text-slate-900 truncate tracking-tight">{thread.participant}</h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{thread.time}</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-500 truncate italic">"{thread.lastMessage}"</p>
                  </div>
                  {thread.unread > 0 && (
                    <div className="w-5 h-5 bg-[var(--primary)] text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                      {thread.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Chat Window */}
          <div className="flex-1 flex flex-col bg-white">
            {activeThread ? (
              <>
                {/* Chat Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                        {activeThread.isSystem ? <Bell size={20} className="text-indigo-600" /> : activeThread.isAI ? <Bot size={20} className="text-[var(--primary)]" /> : (
                           <SafeImage src={activeThread.avatar} companyName={activeThread.participant} className="w-full h-full object-contain p-2" />
                        )}
                     </div>
                     <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                           {activeThread.participant}
                           {activeThread.isAI && <Zap size={10} className="fill-amber-400 text-amber-400" />}
                        </h3>
                        <div className="flex items-center gap-2">
                           <Circle size={6} className={activeThread.status === 'online' ? 'fill-emerald-500 text-emerald-500' : 'fill-slate-300 text-slate-300'} />
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Synchronization {activeThread.status}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-[var(--primary)] hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                        <Phone size={18} />
                     </button>
                     <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-[var(--primary)] hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                        <Video size={18} />
                     </button>
                     <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-all border border-transparent">
                        <MoreVertical size={18} />
                     </button>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8 bg-slate-50/20">
                   {chatLoading ? (
                      <div className="flex items-center justify-center h-full">
                         <div className="w-8 h-8 border-4 border-slate-100 border-t-[var(--primary)] rounded-full animate-spin"></div>
                      </div>
                   ) : messages.map((m, idx) => (
                      <div 
                        key={m._id || idx} 
                        className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                         <div 
                           className={`max-w-[70%] space-y-2 ${m.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col ${m.fullContext ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                           onClick={() => {
                             if (m.fullContext) {
                               setSelectedNotif(m.fullContext);
                               if (!m.fullContext.isRead) {
                                 setNotifications(prev => prev.map(n => (n._id === m.fullContext._id || n.id === m.fullContext.id) ? { ...n, isRead: true } : n));
                               }
                             }
                           }}
                         >
                            <div className={`px-6 py-4 rounded-[1.5rem] text-sm font-medium shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2 ${
                               m.sender === 'me' 
                                 ? 'bg-slate-900 text-white rounded-tr-none' 
                                 : m.sender === 'AI'
                                    ? 'bg-[var(--primary)] text-white rounded-tl-none shadow-primary/20'
                                    : m.fullContext 
                                        ? 'bg-indigo-50 border border-indigo-100 text-slate-800 rounded-tl-none shadow-sm'
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                            }`}>
                               {m.text}
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">{m.time}</span>
                         </div>
                      </div>
                   ))}
                   <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-8 border-t border-slate-50">
                   <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-2 rounded-[1.5rem] focus-within:ring-4 focus-within:ring-[var(--primary-light)] focus-within:bg-white transition-all">
                      <button type="button" className="p-3 text-slate-400 hover:text-[var(--primary)] transition-all">
                        <Paperclip size={20} />
                      </button>
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Establish synchronization payload..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600 placeholder:text-slate-300 placeholder:italic"
                      />
                      <button 
                        type="submit"
                        disabled={!newMessage.trim() || activeThread.isSystem}
                        className="p-3 bg-[var(--primary)] text-white rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 hover:bg-[var(--primary-dark)] transition-all active:scale-95"
                      >
                         <Send size={20} />
                      </button>
                   </form>
                   <div className="mt-4 flex items-center justify-center gap-4 opacity-30 select-none">
                      <ShieldCheck size={12} className="text-emerald-500" />
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em]">End-to-End Encryption Synchronized</span>
                   </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8">
                 <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                    <Inbox size={48} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Node Connection Required</h3>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto">Select an active transmission node from the left matrix to begin carrier synchronization.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Context Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedNotif(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedNotif(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 shrink-0">
                {selectedNotif.type === 'Application' ? <MessageSquare size={20} /> :
                 selectedNotif.type === 'Selection' ? <CheckCircle2 size={20} /> :
                 selectedNotif.type === 'Invitation' ? <Sparkles size={20} /> :
                 selectedNotif.type === 'System' ? <AlertCircle size={20} /> :
                 <Bell size={20} />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedNotif.senderName || 'JobGrox System'}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedNotif.type || 'Notification'}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-6">
              <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                {selectedNotif.message}
              </p>
            </div>
            
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span>{selectedNotif.createdAt ? format(new Date(selectedNotif.createdAt), 'MMMM d, yyyy - h:mm a') : 'Recent Activity'}</span>
              <button 
                onClick={() => setSelectedNotif(null)}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
