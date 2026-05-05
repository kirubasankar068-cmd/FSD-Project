import Layout from "../components/Layout";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
  Briefcase, DollarSign, MapPin, ChevronRight,
  Bookmark, MoreVertical, Cpu, Zap, Award,
  Settings, Mail, Globe, Star, ArrowRight, Radio, ShieldCheck, Activity, 
  Users, Send, Check, Loader2, Target, BarChart3, TrendingUp, 
  Layers, Database, Compass, Bell, Shield, Calendar, Sparkles,
  Search, LogOut, ChevronLeft, LayoutDashboard, FileText, UserCircle, CheckCircle
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Cell, LineChart, Line
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

export default function CandidateDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostComplete, setBoostComplete] = useState(false);
  const [pulseSignals, setPulseSignals] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const setActiveTab = (newTab) => setSearchParams({ tab: newTab });

  const navigate = useNavigate();

  const handleNeuralBoost = () => {
    setIsBoosting(true);
    setTimeout(() => {
      setIsBoosting(false);
      setBoostComplete(true);
      setPulseSignals([
        { entity: 'Google', signal: 'Profile Viewed', time: 'Just now', type: 'view' },
        { entity: 'Meta', signal: 'Skill Match High', time: '2m ago', type: 'match' },
        { entity: 'OpenAI', signal: 'Interview Pending', time: '5m ago', type: 'iv' }
      ]);
    }, 3000);
  };

  useEffect(() => {
    const fetchUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try { setUser(JSON.parse(userData)); } catch (e) {}
      }
      setLoading(false);
    };
    fetchUser();

    const fetchSignals = async () => {
       try {
          const { userAPI, jobsAPI } = await import("../services/api");
          const [notifications, apps, recent] = await Promise.all([
            userAPI.getNotifications(),
            userAPI.getMyApplications(),
            jobsAPI.getAll({ limit: 3 })
          ]);
          
          const signals = notifications.map(n => ({
             entity: n.senderName || 'System',
             signal: n.message,
             time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
             type: n.type?.toLowerCase() || 'pulse'
          }));
          setPulseSignals(signals.slice(0, 10));
          setRecentApps(apps.slice(0, 3));
          setRecentJobs(recent.jobs ? recent.jobs.slice(0, 3) : recent.slice(0, 3));
       } catch (err) {
          console.error("Data fetch failure:", err);
       }
    };

    fetchSignals();
    // Refresh signals periodically
    const signalInterval = setInterval(fetchSignals, 30000);
    return () => clearInterval(signalInterval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  if (loading || !user) return (
    <Layout>
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Initializing Terminal...</p>
        </div>
      </div>
    </Layout>
  );

  const atsScore = user.resumeData?.atsScore || 84;
  const userSkills = user.skills?.slice(0, 6) || ['React', 'Node.js', 'System Design', 'Cloud Arch', 'TypeScript'];
  const displayName = user.name || 'User Node';
  const displayRole = user.role || user.resumeData?.title || 'Senior Systems Architect';

  const velocityData = [
    { name: 'Jan', value: 12 }, { name: 'Feb', value: 18 }, { name: 'Mar', value: 25 }, 
    { name: 'Apr', value: 32 }, { name: 'May', value: 40 }, { name: 'Jun', value: 48 }
  ];

  const skillRadar = [
    { subject: 'Technical', A: 120 },
    { subject: 'Leadership', A: 98 },
    { subject: 'Strategy', A: 86 },
    { subject: 'Cloud', A: 140 },
    { subject: 'Security', A: 110 }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden font-body text-slate-900">
        <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
          
          {/* HEADER */}
          <header className="h-20 bg-white/80 backdrop-blur-xl sticky top-0 flex items-center justify-between px-8 shrink-0 z-40 border-b border-slate-200/40">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                   <LayoutDashboard size={20} className="text-white" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.3em]">Candidate Terminal</h2>
             </div>
             
             <div className="flex items-center gap-6">
                <button onClick={handleNeuralBoost} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${boostComplete ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-primary hover:shadow-xl hover:shadow-primary/20'}`}>
                   {isBoosting ? <Loader2 className="animate-spin mx-auto" size={14} /> : boostComplete ? 'Neural Optimized' : 'Boost Neural Visibility'}
                </button>
                <div className="h-8 w-[1px] bg-slate-200" />
                <div className="flex items-center gap-3">
                   <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black leading-none">{displayName}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Level {user.experience || 5} Node</p>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-sm border border-slate-200">{displayName[0]}</div>
                </div>
             </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar pb-24">
             <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="space-y-10">
                     {/* Stats Row */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                          { label: 'AI Match Index', val: '92%', icon: Sparkles, color: 'text-indigo-500' },
                          { label: 'Market Visibility', val: 'Elite', icon: Zap, color: 'text-primary' },
                          { label: 'ATS Alignment', val: `${atsScore}%`, icon: Target, color: 'text-emerald-500' },
                          { label: 'System Rank', val: '#42', icon: Award, color: 'text-amber-500' }
                        ].map((s, i) => (
                          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-white shadow-premium group hover-lift overflow-hidden relative">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                             <div className="relative z-10 space-y-4">
                                <div className={`p-3 w-fit rounded-2xl bg-slate-50 ${s.color}`}><s.icon size={22} /></div>
                                <div>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                                   <h3 className="text-2xl font-black italic tracking-tighter">{s.val}</h3>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>

                     <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* Intelligence Row */}
                        <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                           <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-premium flex flex-col md:flex-row gap-10 items-center">
                              <div className="w-48 h-48 shrink-0 relative">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadar}>
                                       <PolarGrid stroke="#e2e8f0" />
                                       <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                                       <Radar name="Skills" dataKey="A" stroke="#5956E9" fill="#5956E9" fillOpacity={0.6} />
                                    </RadarChart>
                                 </ResponsiveContainer>
                              </div>
                              <div className="flex-1 space-y-6">
                                 <h3 className="text-xl font-black italic">Skill <span className="text-primary">Intelligence</span></h3>
                                 <p className="text-sm text-slate-500 font-medium leading-relaxed">Your neural profile shows high proficiency in Cloud and Technical nodes. Consider upgrading Strategy to reach Top 1% rank.</p>
                                 <div className="flex gap-4">
                                    <button onClick={() => navigate('/skills')} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-primary transition-all">Analyze Gap</button>
                                    <button onClick={() => navigate('/ai-match')} className="px-6 py-3 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-2xl hover:bg-slate-100 transition-all">Refine Matching</button>
                                 </div>
                              </div>
                           </div>
                           <div className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200">
                              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -mr-10 -mb-10" />
                              <div className="relative z-10 space-y-8">
                                 <div className="space-y-2">
                                    <h4 className="text-sm font-black uppercase tracking-widest opacity-60">Resume Strength</h4>
                                    <h2 className="text-5xl font-black italic tracking-tighter">94<span className="text-2xl opacity-60">/100</span></h2>
                                 </div>
                                 <p className="text-[10px] font-bold leading-relaxed opacity-80 uppercase tracking-widest">Your resume is optimized for FAANG nodes. 4 minor improvements detected.</p>
                                 <button onClick={() => navigate('/resume-parser')} className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">Deep Parse Resume</button>
                              </div>
                           </div>
                        </div>                        {/* RECENT JOBS & APPLICATIONS */}
                        <div className="xl:col-span-8 space-y-8">
                           {/* Recent Jobs */}
                           <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-premium">
                              <div className="flex items-center justify-between mb-8">
                                 <h3 className="text-xl font-black italic tracking-tight">Recommended <span className="text-primary">Jobs</span></h3>
                                 <button onClick={() => navigate('/jobs')} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">Browse All <ChevronRight size={14}/></button>
                              </div>
                              <div className="space-y-4">
                                 {recentJobs.length > 0 ? recentJobs.map(job => (
                                    <div key={job._id} className="p-4 rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all flex items-center justify-between">
                                       <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary"><Briefcase size={20}/></div>
                                          <div>
                                             <h4 className="font-bold text-slate-900">{job.title}</h4>
                                             <p className="text-xs font-medium text-slate-500">{job.company} • {job.location}</p>
                                          </div>
                                       </div>
                                       <button onClick={() => navigate(`/job/${job._id}`)} className="px-4 py-2 bg-slate-100 hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all">View</button>
                                    </div>
                                 )) : (
                                    <p className="text-sm text-slate-400">No recent jobs available.</p>
                                 )}
                              </div>
                           </div>

                           {/* Recent Applications */}
                           <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-premium">
                              <div className="flex items-center justify-between mb-8">
                                 <h3 className="text-xl font-black italic tracking-tight">Application <span className="text-primary">Status</span></h3>
                                 <button onClick={() => navigate('/applications')} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">Track All <ChevronRight size={14}/></button>
                              </div>
                              <div className="space-y-4">
                                 {recentApps.length > 0 ? recentApps.map(app => (
                                    <div key={app._id} className="p-4 rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all flex items-center justify-between">
                                       <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-500"><CheckCircle size={20}/></div>
                                          <div>
                                             <h4 className="font-bold text-slate-900">{app.jobId?.title || 'Unknown Role'}</h4>
                                             <p className="text-xs font-medium text-slate-500">{app.jobId?.company || 'Unknown Company'}</p>
                                          </div>
                                       </div>
                                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${app.status === 'Hired' ? 'bg-emerald-100 text-emerald-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                          {app.status}
                                       </span>
                                    </div>
                                 )) : (
                                    <p className="text-sm text-slate-400">No recent applications.</p>
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* SIGNALS */}
                        <div className="xl:col-span-4 bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:bg-primary/40 transition-all duration-1000" />
                           <h3 className="text-lg font-black italic tracking-tight mb-8 relative z-10">Neural <span className="text-primary">Pulse</span></h3>
                           <div className="space-y-6 relative z-10 h-[300px] overflow-y-auto hide-scrollbar">
                              {pulseSignals.map((sig, i) => (
                                <div key={i} className="flex gap-4 items-start group/sig cursor-pointer">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sig.type === 'view' ? 'bg-indigo-500/20 text-indigo-400' : sig.type === 'match' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                      {sig.type === 'view' ? <Globe size={18}/> : sig.type === 'match' ? <Zap size={18}/> : <Mail size={18}/>}
                                   </div>
                                   <div className="space-y-1">
                                      <p className="text-xs font-bold group-hover/sig:text-primary transition-colors">{sig.entity}</p>
                                      <p className="text-[10px] text-slate-400 font-medium leading-tight">{sig.signal}</p>
                                      <p className="text-[8px] font-black uppercase text-slate-600 tracking-widest">{sig.time}</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </main>
      </div>
    </Layout>
  );
}
