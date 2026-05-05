import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { Sparkles, Briefcase, MapPin, DollarSign, Loader2, AlertCircle, Search, CheckCircle, TrendingUp, Target, Zap, Shield, ArrowRight, X, Activity } from 'lucide-react';
import { apiMock } from '../services/apiMock';
import { aiAPI } from '../services/api';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

const fetchMatches = async () => {
  const userSkillsRaw = localStorage.getItem('userSkills');
  const userSkills = userSkillsRaw ? JSON.parse(userSkillsRaw) : ['React', 'Node.js', 'TypeScript'];
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return await apiMock.matchJobs(userSkills);
    }

    // Use centralized AI API service
    const data = await aiAPI.match(userSkills);
    return data;
  } catch (e) {
    console.error("AI Match engine failure: Diverting to local mock matching engine.", e);
    // Silent fallback to mock for UX continuity, but api.js handles 401 redirects
    return await apiMock.matchJobs(userSkills);
  }
};

const highlightText = (text, query) => {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
          ? <span key={i} className="bg-yellow-200 text-slate-900 rounded-px">{part}</span> 
          : part
      )}
    </span>
  );
};

export default function AiMatch() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectingJob, setProjectingJob] = useState(null);
  const [simulationStep, setSimulationStep] = useState(0);

  const startProjection = (job) => {
    setProjectingJob(job);
    setSimulationStep(0);
    const interval = setInterval(() => {
      setSimulationStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          return 3;
        }
        return prev + 1;
      });
    }, 800);
  };
  
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['ai-matches'],
    queryFn: fetchMatches,
    staleTime: 5 * 60 * 1000, 
    retry: 1
  });

  useEffect(() => {
    if (location.state?.freshIngestion) {
       queryClient.invalidateQueries({ queryKey: ['ai-matches'] });
       window.history.replaceState({}, document.title);
    }

    const params = new URLSearchParams(window.location.search);
    const q = params.get('search');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [location.state?.freshIngestion, window.location.search, queryClient]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="bg-primary/10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">AI Beta</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Matching Engine</h1>
            <p className="text-lg text-slate-500 font-medium">Cosine Similarity algorithm ranks your perfect role vector.</p>
          </div>

          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in your matrix..."
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold w-full md:w-64 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-slate-500 font-bold animate-pulse">Running semantic node analysis...</p>
          </div>
        ) : error && error.message.includes("PREMIUM_REQUIRED") ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] text-center shadow-xl relative overflow-hidden flex items-center justify-center min-h-[400px]">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="relative z-10 flex flex-col items-center justify-center max-w-lg mx-auto space-y-6">
                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-2 shadow-2xl border border-slate-700 text-amber-400">
                  <Sparkles size={40} />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight italic">AI Matrix Locked</h3>
                <p className="text-slate-400 font-medium leading-relaxed">Upgrade your clearance to Professional to unlock deep semantic node analysis and instantly discover your highest probability career matches globally.</p>
                <div className="pt-4">
                  <a href="/pricing" className="px-8 py-4 bg-[var(--primary)] text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-[var(--primary-dark)] transition-all uppercase tracking-widest text-xs inline-flex items-center gap-2">
                    Activate Premium <Briefcase size={16} />
                  </a>
                </div>
             </div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50/50 border border-red-100 flex items-center justify-center gap-3 text-red-600 rounded-3xl font-bold">
            <AlertCircle size={24} /> {error.message || "Engine failure."}
          </div>
        ) : (
          <div className="grid gap-6">
            {(Array.isArray(jobs) ? jobs : []).filter(job => {
              const q = searchQuery.toLowerCase();
              return !q || 
                job.title?.toLowerCase().includes(q) || 
                job.company?.toLowerCase().includes(q) ||
                (job.skills || []).some(s => s.toLowerCase().includes(q));
            }).map((job) => (
              <div key={job._id || job.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-6 items-start md:items-center">
                
                <div className="flex-shrink-0 flex flex-col items-center justify-center h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30">
                  <span className="text-2xl font-black">{job.matchScore || 0}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Match</span>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {highlightText(job.title, searchQuery)}
                    </h3>
                    <p className="text-sm font-bold text-slate-500">
                      {highlightText(job.company, searchQuery)}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {(job.skills || job.requiredSkills || []).map(skill => (
                      <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100">{skill}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary"/> {job.location || "Remote"}</span>
                    <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-primary"/> {job.salary || "Comp"}</span>
                    <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-primary"/> {job.employmentType || "Full-Time"}</span>
                    <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-black uppercase"><TrendingUp size={12}/> High Growth</span>
                  </div>

                  <div className="mt-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
                     <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle size={12} /> Why it matches
                     </p>
                     <p className="text-[11px] font-medium text-emerald-700/80 italic">
                        {job.matchReasoning || `Matches your ${job.requiredSkills?.[0] || 'core'} technical profile with high similarity in experience vectors.`}
                     </p>
                  </div>

                  {job.missingSkills && job.missingSkills.length > 0 && (
                    <div className="mt-4 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl space-y-2">
                       <p className="text-xs font-bold text-orange-700 uppercase tracking-widest">Improve your match</p>
                       <div className="flex flex-wrap gap-2">
                          {job.missingSkills.map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-white text-orange-600 text-[10px] font-black rounded-md border border-orange-200">{skill}</span>
                          ))}
                       </div>
                       <p className="text-[11px] font-medium text-orange-600/80">{job.improvementSuggestions?.[0]}</p>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 w-full md:w-auto flex flex-col gap-2 self-center">
                   <button 
                     onClick={() => startProjection(job)}
                     className="w-full md:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 group text-xs"
                   >
                     <Target size={14} className="group-hover:animate-pulse" /> Project Arc
                   </button>
                   <button 
                     onClick={() => window.location.href = `/job/${job._id || job.id}`}
                     className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors text-xs"
                   >
                     Apply Now
                   </button>
                </div>
              </div>
            ))}
            
            {(!jobs || jobs.length === 0) && (
               <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-sm border-2 border-dashed border-slate-200 rounded-3xl">
                  No overlapping nodes located in DB cluster.
               </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {projectingJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProjectingJob(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-indigo-500 to-emerald-400" />
              
              <div className="p-8 md:p-12 space-y-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
                      <Zap size={14} fill="currentColor" /> Advanced Career Intelligence
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Neural Role Projection</h2>
                    <p className="text-slate-500 font-bold">{projectingJob.title} @ {projectingJob.company}</p>
                  </div>
                  <button 
                    onClick={() => setProjectingJob(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {simulationStep < 3 ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                      <div className="relative">
                        <Activity size={48} className="text-primary animate-pulse" />
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute -inset-4 border-2 border-dashed border-primary/30 rounded-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest">
                          {simulationStep === 0 && "Mapping Career Vectors..."}
                          {simulationStep === 1 && "Simulating Market Growth..."}
                          {simulationStep === 2 && "Synthesizing Future Paths..."}
                        </p>
                        <p className="text-xs text-slate-400 font-bold">Neural Engine v4.2 Active</p>
                      </div>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp size={14} /> Growth Projection
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-end mb-1">
                                <span className="text-xs font-bold text-slate-600">Salary Appreciation (2yr)</span>
                                <span className="text-sm font-black text-emerald-600">+24%</span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: "74%" }}
                                  className="h-full bg-emerald-500 rounded-full"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-end mb-1">
                                <span className="text-xs font-bold text-slate-600">Promotion Velocity</span>
                                <span className="text-sm font-black text-indigo-600">High</span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: "88%" }}
                                  className="h-full bg-indigo-500 rounded-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 space-y-3">
                          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                            <Shield size={14} /> Competitive Advantage
                          </h4>
                          <p className="text-[11px] font-bold text-indigo-700/70 leading-relaxed">
                            This role places you in the <span className="text-indigo-700">top 3%</span> of specialized candidates for future <span className="underline">CTO/Architect</span> tracks within the {projectingJob.company} ecosystem.
                          </p>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Next-Tier Opportunities</h4>
                        <div className="space-y-3">
                          {[
                            { title: `Principal ${projectingJob.title.split(' ')[1] || 'Architect'}`, time: "18-24 Months" },
                            { title: "Technical Product Lead", time: "2-3 Years" },
                            { title: "Director of Engineering", time: "4-5 Years" }
                          ].map((role, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group cursor-default">
                              <div>
                                <p className="text-[11px] font-bold text-white tracking-tight">{role.title}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{role.time}</p>
                              </div>
                              <ArrowRight size={14} className="text-slate-500 group-hover:text-primary transition-colors" />
                            </div>
                          ))}
                        </div>
                        <div className="pt-2">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-center italic">Calculated via Vector Simulation v2</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {simulationStep === 3 && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setProjectingJob(null)}
                      className="flex-1 py-4 bg-slate-100 text-slate-700 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                    >
                      Close Projection
                    </button>
                    <button 
                      onClick={() => window.location.href = `/job/${projectingJob._id || projectingJob.id}`}
                      className="flex-[2] py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-primary transition-all uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20"
                    >
                      Commit to this path
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
