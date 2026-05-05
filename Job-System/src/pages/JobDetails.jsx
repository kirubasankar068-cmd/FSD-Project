import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  MapPin, Building2, Calendar, DollarSign, Briefcase, 
  ArrowLeft, Share2, Bookmark, CheckCircle2, Sparkles, 
  Zap, AlertCircle, PlayCircle, BookOpen, Clock, Mail, TrendingUp,
  AlertTriangle, RefreshCw, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiMock } from '../services/apiMock';
import { jobsAPI, applicationsAPI } from '../services/api';
import { useAppContext } from '../context/AppContext';

// Skeleton UI Component to prevent blank screen
const JobDetailsSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
    <div className="h-6 w-32 bg-slate-200 rounded-lg mb-10"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-10">
        <div className="bg-white h-80 rounded-[3rem] border border-slate-100 shadow-sm"></div>
        <div className="bg-emerald-50 h-32 rounded-[3rem] border border-emerald-100"></div>
        <div className="bg-white h-[400px] rounded-[3.5rem] border border-slate-100 shadow-sm"></div>
      </div>
      <div className="space-y-8">
        <div className="bg-white h-96 rounded-[3rem] border border-slate-100 shadow-sm"></div>
        <div className="bg-slate-200 h-40 rounded-[3rem]"></div>
      </div>
    </div>
  </div>
);

// Error State Component
const JobErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 border border-red-100">
      <AlertTriangle size={40} />
    </div>
    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Protocol Error Detected</h2>
    <p className="text-slate-500 max-w-md mb-8">{message || 'The requested job protocol could not be retrieved from the central database.'}</p>
    <div className="flex gap-4">
      <button 
        onClick={onRetry}
        className="px-6 py-3 bg-[var(--primary)] text-white rounded-2xl font-bold flex items-center gap-2 hover:shadow-lg transition-all"
      >
        <RefreshCw size={18} /> Retry Sync
      </button>
      <Link 
        to="/jobs"
        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
      >
        <ArrowLeft size={18} /> Return to Jobs
      </Link>
    </div>
  </div>
);

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRecentView, toggleSaveJob, isSaved } = useAppContext();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    console.log(`[DEBUG] Initiating sync for JobId: ${id}`);
    
    try {
      if (id && id.toString().startsWith('65e1a2b3')) {
          const mockJob = await apiMock.getJobById(id);
          if (mockJob) {
              setJob(mockJob);
              addRecentView({ ...mockJob, type: 'job' });
             const userData = JSON.parse(localStorage.getItem('user'));
             setUser(userData);
             setLoading(false);
             return;
          }
      }
      
      const data = await jobsAPI.getById(id);
      console.log(`[DEBUG] Successfully retrieved Job: ${data.title}`);
      setJob(data);
      addRecentView({ ...data, type: 'job' });
      
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
      
      if (userData) {
        try {
          const myApps = await applicationsAPI.getMyApplications();
          const existingApp = myApps.find(a => {
            const jid = a.jobId?._id || a.jobId;
            return jid?.toString() === id?.toString();
          });
          
          if (existingApp && existingApp.status !== 'Rejected') {
            setApplied(true);
          } else {
            setApplied(false);
          }
        } catch (e) {
          console.warn(">> APPS_SYNC_FAIL: Could not check application status.");
        }
      }
    } catch (err) {
      console.error('[DEBUG] Fatal error during sync:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    } else {
      setError('No Job ID provided in route.');
      setLoading(false);
    }
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      if (confirm("You must be logged in to apply. Login now?")) {
        navigate('/login');
      }
      return;
    }

    try {
      await applicationsAPI.create({ jobId: id, userId: user.id });
      setApplied(true);
      showToast(`Application successfully dispatched to ${job?.company || 'the recruiter'}. Check your dashboard for status updates.`, 'success');
    } catch (err) {
      console.error('[DEBUG] Apply error:', err);
      showToast(err.message || 'Transmission failure. Please retry sync.', 'error');
    }
  };

  if (loading) return (
    <Layout>
      <JobDetailsSkeleton />
    </Layout>
  );

  if (error) return (
    <Layout>
      <JobErrorState message={error} onRetry={fetchDetails} />
    </Layout>
  );

  if (!job) return <Layout><JobErrorState onRetry={fetchDetails} /></Layout>;

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        {/* Back Navigation - Aligned & Standardized */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-[0.15em]">Backward Navigation</span>
          </button>
        </div>

        <div className="grid-65-35">
          
          {/* LEFT CONTENT: 65% (Desktop) */}
          <div className="space-y-8">
            
            {/* Header Block: Standardized p-6, radius-lg */}
            <div className="premium-card-v2 relative overflow-hidden group">
               {/* Impact Badge: Integrated into header layout */}
               <div className="absolute top-0 right-0 px-6 py-4 bg-slate-900 text-emerald-400 rounded-bl-3xl flex items-center gap-2 z-10">
                  <Zap size={14} fill="currentColor" />
                  <span className="text-lg font-black">{job.matchScore || 0}% Match</span>
               </div>

               <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-0 mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0 shadow-sm overflow-hidden">
                     <Building2 size={32} className="text-slate-300" />
                  </div>
                  <div className="space-y-2 max-w-2xl">
                     <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-wider">
                           {job.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                           <Clock size={12} /> {job.postedAt}
                        </div>
                     </div>
                     <h1 className="text-[var(--h1)] font-black text-slate-900 tracking-tight leading-[1.1]">
                        {job.title}
                     </h1>
                     <div className="flex flex-wrap items-center gap-4 text-slate-500 font-semibold text-sm">
                        <div className="flex items-center gap-2">
                           <Building2 size={16} className="text-primary" /> {job.company}
                        </div>
                        <div className="flex items-center gap-2">
                           <MapPin size={16} className="text-primary" /> {job.location}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Metadata Grid: 8px alignment */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-50">
                  {[
                    { label: 'Compensation', value: job.salary, icon: <DollarSign size={14}/> },
                    { label: 'Deployment', value: job.type, icon: <Briefcase size={14}/> },
                    { label: 'Requirement', value: job.experience, icon: <Clock size={14}/> },
                    { label: 'Relay Status', value: 'Validated', icon: <CheckCircle2 size={14}/> },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          {item.icon} {item.label}
                       </p>
                       <p className="font-bold text-slate-900">{item.value}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* AI Insights: Balanced with Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-[24px] flex items-start gap-4"
            >
               <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                  <Sparkles size={18} />
               </div>
               <div className="space-y-1">
                  <h3 className="text-[10px] font-black text-emerald-900/60 uppercase tracking-[0.2em] mb-1">AI Match Reasoning</h3>
                  <p className="text-[var(--body)] text-emerald-900/80 leading-relaxed font-medium italic">
                    "{job.matchReasoning || job.whyMatch || "Matches your professional architecture profile."}"
                  </p>
               </div>
            </motion.div>

            {/* Core Documentation */}
            <div className="premium-card-v2 p-8 space-y-10">
               <div className="space-y-4">
                  <h2 className="text-[var(--h2)] font-black text-slate-900">Protocol Specification</h2>
                  <div className="w-12 h-1.5 bg-primary rounded-full"></div>
                  <p className="text-[var(--body)] text-slate-600 leading-relaxed font-medium">
                    {job.description}
                  </p>
               </div>

               <div className="space-y-6 pt-6 border-t border-slate-50">
                  <h2 className="text-[var(--h2)] font-black text-slate-900">Required Skill Clusters</h2>
                  <div className="flex flex-wrap gap-3">
                     {job.skills?.map(skill => (
                       <span key={skill} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs border border-slate-100 hover:border-primary transition-colors cursor-default">
                         {skill}
                       </span>
                     ))}
                  </div>
               </div>
            </div>

            {/* AI Roadmap: Premium Section */}
            <div className="bg-slate-900 p-8 rounded-[32px] text-white overflow-hidden relative group">
               {(!user || !user.isPremium) && (
                 <div className="absolute inset-0 z-20 backdrop-blur-md bg-slate-900/60 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-amber-400 border border-slate-700 shadow-2xl">
                      <Lock size={24} />
                    </div>
                    <h3 className="text-xl font-black mb-1">Roadmap Locked</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-6">Upgrade to Professional to unlock dynamic Skill-Gap analytics.</p>
                    <Link to="/pricing" className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:scale-105 transition-transform">Get Clearance</Link>
                 </div>
               )}
               
               <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Premium Feature</p>
                     <h2 className="text-xl font-black italic">AI Learning Roadmap</h2>
                  </div>
                  <Zap size={20} className="text-amber-400" />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={12} className="text-emerald-400" /> Improvement Suggestion
                     </p>
                     <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-sm font-medium text-slate-300 leading-relaxed">
                           {job.improvementSuggestions?.[0] || "Maintain your current technical trajectory."}
                        </p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <BookOpen size={12} className="text-blue-400" /> Study Vector
                     </p>
                     <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5 animate-pulse"></div>
                        <p className="text-sm font-bold text-slate-100">
                           {job.missingSkills?.length > 0 
                             ? `Deep dive into ${job.missingSkills[0]} via curated enterprise modules.` 
                             : 'Strategic Architecture and Leadership nodes recommended.'}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: 35% (Desktop) */}
          <div className="space-y-6 self-start lg:sticky lg:top-8">
             
             {/* Interaction Card */}
             <div className="premium-card-v2 p-8 space-y-6 bg-slate-50/50">
                <div className="flex items-center justify-between">
                   <div className="flex gap-2">
                      <button 
                         onClick={() => toggleSaveJob(job)}
                         className={`w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl transition-all ${isSaved(job._id || job.id) ? 'text-primary border-primary/20 bg-primary/5' : 'text-slate-400 hover:text-primary'}`}
                       >
                         <Bookmark size={16} className={isSaved(job._id || job.id) ? 'fill-current' : ''}/>
                       </button>
                      <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary transition-all"><Share2 size={16}/></button>
                   </div>
                </div>

                <div className="space-y-3">
                   {!applied ? (
                     <button 
                        onClick={handleApply}
                        className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest"
                     >
                        Dispatched Protocol <CheckCircle2 size={16} />
                     </button>
                   ) : (
                     <div className="w-full py-4 bg-emerald-500 text-white font-black rounded-xl flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest">
                        Sync Confirmed <CheckCircle2 size={16} />
                     </div>
                   )}
                   <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Application Dispatched instantly</p>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-5">
                   {[
                      { label: 'Relay Speed', value: job.isPremium ? 'Instant API' : 'Standard 12h Cycle', icon: <Clock size={14}/> },
                      { label: 'Channel', value: 'Direct Manager Relay', icon: <Mail size={14}/> },
                      { label: 'Recruiter Status', value: 'Active Now', icon: <div className="w-2 h-2 rounded-full bg-emerald-500"></div> }
                   ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">{item.icon}</div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                          <p className="font-bold text-slate-800 text-xs">{item.value}</p>
                       </div>
                    </div>
                   ))}
                </div>
             </div>

             {/* Dynamic Insight Card: Matches Premium Theme */}
             <div className="bg-indigo-900 p-8 rounded-[32px] text-white relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {user?.isPremium ? (
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <TrendingUp size={20} className="text-emerald-400" />
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-indigo-300">Optimization Tip</h4>
                     </div>
                     <p className="text-sm font-medium leading-relaxed italic text-indigo-50">
                        {String(job.experience || '').includes('Senior') || (typeof job.experience === 'number' && job.experience >= 5)
                          ? "This senior architect node requires validation of leadership experience. Bolster your projects section with high-impact results to increase conversion."
                          : `High demand for ${job.skills?.[0] || 'technical'} proficiency in this sector. Prioritize this skill in your profile data.`}
                     </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                    <Lock size={20} className="text-indigo-300 opacity-50" />
                    <h4 className="font-black text-xs uppercase tracking-widest opacity-80">Premium Insider Logic</h4>
                    <Link to="/pricing" className="px-6 py-2.5 bg-white text-indigo-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">Unlock Secret</Link>
                  </div>
                )}
             </div>
          </div>

        </div>
      </motion.div>
    </Layout>

  );
}
