import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Briefcase, Building2, Calendar, MapPin, CheckCircle, Search, Filter } from 'lucide-react';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await userAPI.getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending': return { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Under Review' };
      case 'Matched': return { color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Synchronized' };
      case 'Interviewed': return { color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100', label: 'Operational' };
      case 'Hired': return { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Deployed' };
      case 'Rejected': return { color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', label: 'Terminated' };
      default: return { color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100', label: 'Idle' };
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-16 pb-20">
        <div className="space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Application <span className="text-[var(--primary)]">Track</span></h1>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Transmission Monitor | System Synchronized</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
               <div className="px-6 py-2 text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Protocols</p>
                  <p className="text-2xl font-bold text-slate-800 tracking-tighter">{applications.length}</p>
               </div>
               <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center text-[var(--primary)]">
                  <Briefcase size={22} />
               </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 animate-pulse h-32"></div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-sm text-center space-y-8">
               <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                  <Briefcase size={48} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Zero Active Signals</h3>
                  <p className="text-slate-500 font-medium max-w-md mx-auto italic">No deployment protocols initiated. Synchronize your profile with active targets.</p>
               </div>
               <button onClick={() => navigate('/jobs')} className="px-10 py-4 bg-[var(--primary)] text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-[var(--primary-dark)] transition-all">
                  Initialize Search
               </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
               {applications.map((app, idx) => {
                 const config = getStatusConfig(app.status);
                 return (
                   <div 
                     key={app._id} 
                     className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                   >
                     <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="flex items-center gap-6 flex-1">
                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[var(--primary)] border border-slate-100 group-hover:scale-110 transition-transform">
                              <Building2 size={28} />
                           </div>
                           <div className="space-y-1">
                              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{app.jobId?.title || 'Protocol Undefined'}</h3>
                              <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest">{app.jobId?.company || 'Entity Redacted'}</p>
                              <div className="flex items-center gap-6 pt-2">
                                 <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <MapPin size={12} className="text-[var(--primary)]" />
                                    {app.jobId?.location || 'Global/Remote'}
                                 </span>
                                 <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Calendar size={12} className="text-[var(--primary)]" />
                                    {new Date(app.createdAt).toLocaleDateString()}
                                 </span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-10 w-full lg:w-auto border-t lg:border-none border-slate-50 pt-6 lg:pt-0">
                           <div className="space-y-1 text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Operational State</p>
                              <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${config.bg} ${config.color} ${config.border}`}>
                                 {config.label}
                              </div>
                           </div>
                           <button className="px-6 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all text-xs">
                              Review
                           </button>
                        </div>
                     </div>
                   </div>
                 );
               })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}


