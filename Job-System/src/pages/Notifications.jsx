import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Bell, CheckCircle2, MessageSquare, AlertCircle, Sparkles, Trash2, Search, Filter, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { apiMock } from '../services/apiMock';
import { userAPI } from '../services/api';
import { format } from 'date-fns';

export default function Notifications() {
  const { notifications, setNotifications, markRead } = useAppContext();
  const [loading, setLoading] = useState(notifications.length === 0);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (notifications.length > 0) return; // Only fetch if empty
      setLoading(true);
      try {
        const data = await userAPI.getNotifications();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Transmission error in communication matrix:', error);
        const mockNotifs = await apiMock.getMyNotifications();
        setNotifications(mockNotifs);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [notifications.length, setNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case 'Application': return <MessageSquare className="text-blue-500" size={20} />;
      case 'Selection': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'Invitation': return <Sparkles className="text-purple-500" size={20} />;
      case 'System': return <AlertCircle className="text-amber-500" size={20} />;
      default: return <Bell className="text-slate-400" size={20} />;
    }
  };

  const filteredNotifs = notifications.filter(n => {
    const matchesFilter = filterType === 'all' || n.type === filterType;
    const msg = n.message || "";
    const sender = n.senderName || "";
    const matchesSearch = msg.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sender.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotif = (id) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight font-header italic">
              Communication <span className="text-indigo-600">Matrix.</span>
            </h1>
            <p className="text-slate-500 font-medium">Real-time synchronization of your professional network nodes.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={markAllRead}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              Sync All Read
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search transmission logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            {['all', 'Application', 'Selection', 'System'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === type ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
             <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-28 bg-white border border-slate-100 rounded-3xl animate-pulse" />
                ))}
             </div>
          ) : filteredNotifs.length > 0 ? (
            filteredNotifs.map((notif, idx) => (
              <div 
                key={notif._id || idx}
                onClick={() => {
                  setSelectedNotif(notif);
                  if (!notif.isRead) {
                    setNotifications(prev => prev.map(n => (n._id === notif._id || n.id === notif.id) ? { ...n, isRead: true } : n));
                  }
                }}
                className={`group relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-6 transition-all hover:shadow-xl hover:translate-y-[-2px] cursor-pointer ${!notif.isRead ? 'border-l-4 border-l-indigo-600' : ''}`}
              >
                {/* Background Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 opacity-50`} />
                
                <div className="relative flex gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 group-hover:rotate-3`}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{notif.type}</span>
                        {!notif.isRead && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                        {notif.createdAt ? format(new Date(notif.createdAt), 'MMM d, h:mm a') : 'Recent'}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {notif.senderName} <span className="text-slate-400 font-medium whitespace-nowrap text-xs ml-1">— Signal Detected</span>
                    </h3>
                    
                    <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">
                      {notif.message}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotif(notif._id || notif.id);
                      }}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Terminate Node"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Bell size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Zero Network Feedback</h3>
              <p className="text-slate-400 mt-2 max-w-xs mx-auto">Your signal is clean. No active notifications detected in this sector.</p>
            </div>
          )}
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
                {getIcon(selectedNotif.type)}
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
