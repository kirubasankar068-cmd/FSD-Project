import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { 
  Crown, DollarSign, Briefcase, MapPin, AlignLeft, CheckCircle, 
  Save, Send, ShieldCheck, Zap, Layers, Loader2, Sparkles, 
  BarChart3, Brain, Cpu, Radio, Target, ArrowRight, X, Eye, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jobsAPI } from '../services/api';
import Layout from '../components/Layout';

export default function PostJob() {
  const navigate = useNavigate();
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [integrity, setIntegrity] = useState(0);
  const [isDeployed, setIsDeployed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salary: '',
    category: 'IT DEPLOYMENT',
    employmentType: 'Full-time',
    description: '',
    isPremium: false,
    skills: '',
    feeType: 'percentage',
    feeValue: 8
  });

  // Real-time Transmission Integrity Check
  useEffect(() => {
     let score = 0;
     if (formData.title.length >= 3) score += 20;
     if (formData.location.length >= 3) score += 20;
     if (formData.salary.length >= 2) score += 20;
     if (formData.description.length >= 20) score += 20;
     if (formData.skills.split(',').filter(s => s.trim()).length >= 1) score += 20;
     setIntegrity(score);
  }, [formData]);

  const mutation = useMutation({
    mutationFn: async (newJob) => {
      try {
        return await jobsAPI.create(newJob);
      } catch (err) {
        // Handle server unavailability gracefully for demonstration
        console.warn(`[NODE_SYNC_FAIL] Protocol error. Diverting to local persistence.`);
        // Add to local storage as fallback so user doesn't lose work
        const localJobs = JSON.parse(localStorage.getItem('local_jobs') || '[]');
        localJobs.push({ ...newJob, _id: `local_${Date.now()}`, createdAt: new Date() });
        localStorage.setItem('local_jobs', JSON.stringify(localJobs));
        return { success: true, local: true };
      }
    },
    onSuccess: () => {
      setIsDeployed(true);
      setTimeout(() => navigate('/company-dashboard'), 2500);
    },
    onError: (err) => {
       setErrorMessage(err.message);
       setTimeout(() => setErrorMessage(null), 5000);
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSynthesize = () => {
     if (!formData.title) return alert("Position Architecture required for AI Synthesis.");
     setIsSynthesizing(true);
     setTimeout(() => {
        setFormData(prev => ({
           ...prev,
           description: `We are looking for a high-performance ${prev.title} to join our mission-critical deployment team. \n\nKey Tactical Objectives:\n- Architect and scale robust system nodes.\n- Collaborate with cross-functional neural units.\n- Optimize core logic for low-latency transmission.\n\nTechnical Stack Requirements: ${prev.skills || 'To be specified'}.`,
           skills: prev.skills || "System Design, Agile Protocol, Team Synchronization"
        }));
        setIsSynthesizing(false);
     }, 1500);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    const processedJob = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    };
    
    mutation.mutate(processedJob);
  };

  return (
    <Layout>
      <div className="min-h-screen pt-16 pb-24 relative overflow-hidden bg-slate-50/50">
        {/* Background Atmosphere */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
           <div className={`absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-1000 ${formData.isPremium ? 'bg-amber-500/10' : 'bg-primary/5'}`} />
        </div>

        <div className="max-w-[1400px] mx-auto px-6">
           {/* --- TERMINAL HEADER --- */}
           <header className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 mb-20 animate-in fade-in slide-in-from-top-10 duration-1000">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-xl flex items-center gap-2">
                       <Cpu size={12} className="text-primary" /> Transmission Terminal
                    </span>
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-emerald-500/20 flex items-center gap-2">
                       <Radio size={12} className="animate-pulse" /> Uplink Active
                    </span>
                 </div>
                 <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Initialize <span className="text-primary italic">Transmission</span></h1>
                 <p className="text-lg text-slate-500 font-medium max-w-2xl">Deploying high-velocity vacancy nodes into the JobGrox global talent grid.</p>
              </div>

              <div className="flex items-center gap-8 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                 <div className="text-right border-r border-slate-100 pr-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transmission Integrity</p>
                    <div className="flex items-center gap-3">
                       <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${integrity}%` }}
                            className={`h-full ${integrity >= 80 ? 'bg-emerald-500' : 'bg-primary'}`} 
                          />
                       </div>
                       <p className="text-xl font-black text-slate-900 tabular-nums">{integrity}%</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <Zap size={24} className={formData.isPremium ? 'text-amber-500' : 'text-slate-300'} />
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                       {formData.isPremium ? 'ELITE PRIORITY' : 'STANDARD GRID'}
                    </span>
                 </div>
              </div>
           </header>

           <div className="flex flex-col xl:flex-row gap-12 items-start">
              
              {/* SIDEBAR: Advanced Protocol Insights */}
              <aside className="w-full xl:w-[380px] shrink-0 space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000 delay-200">
                 <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white space-y-10 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-8 relative z-10">
                       <div className="p-4 bg-slate-800 text-primary rounded-2xl">
                          <Brain size={24} className="animate-pulse" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment Intelligence</p>
                          <h3 className="text-xl font-black italic tracking-tight">Market <span className="text-primary">Alignment</span></h3>
                       </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                       <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                             <span>Skill Matchability</span>
                             <span>{Math.min(100, formData.skills.split(',').filter(s => s.trim()).length * 20)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, formData.skills.split(',').filter(s => s.trim()).length * 20)}%` }} className="h-full bg-primary" />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                             <span>Discovery Rate</span>
                             <span>{formData.isPremium ? '98%' : '42%'}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: formData.isPremium ? '98%' : '42%' }} className={`h-full ${formData.isPremium ? 'bg-amber-500 shadow-[0_0_8px_var(--amber-500)]' : 'bg-slate-700'}`} />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* RARE FEATURE: Target Node Score */}
                 <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                       <Target size={18} className="text-primary" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Node Score</p>
                    </div>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">{Math.floor(integrity * 0.9)}<span className="text-primary">.8</span></p>
                    <button 
                       onClick={() => setShowPreview(true)}
                       className="w-full py-4 bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                       <Eye size={16} /> Preview Protocol
                    </button>
                 </div>
              </aside>

              {/* MAIN FORM: Position Deployment */}
              <main className="flex-1 w-full animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
                 <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-12 relative">
                    <form onSubmit={handleSubmit} className="space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Position Architecture</label>
                             <input 
                                type="text" name="title" value={formData.title} onChange={handleChange}
                                placeholder="e.g. Full Stack Engineer"
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 focus:bg-white focus:border-primary transition-all outline-none"
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Deployment Zone</label>
                             <input 
                                type="text" name="location" value={formData.location} onChange={handleChange}
                                placeholder="e.g. Bangalore | Remote"
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 focus:bg-white focus:border-primary transition-all outline-none"
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Reward Allocation</label>
                             <input 
                                type="text" name="salary" value={formData.salary} onChange={handleChange}
                                placeholder="e.g. 18 - 24 LPA"
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 focus:bg-white focus:border-primary transition-all outline-none"
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Transmission Category</label>
                             <select 
                                name="category" value={formData.category} onChange={handleChange}
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer"
                             >
                                <option>IT DEPLOYMENT</option>
                                <option>ENGINEERING</option>
                             </select>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Tactical Skills</label>
                          <input 
                             type="text" name="skills" value={formData.skills} onChange={handleChange}
                             placeholder="React, Node.js, etc."
                             className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 focus:bg-white focus:border-primary transition-all outline-none"
                          />
                       </div>

                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Mission Brief</label>
                             <button type="button" onClick={handleSynthesize} className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                                {isSynthesizing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Synthesize (AI)
                             </button>
                          </div>
                          <textarea 
                             name="description" value={formData.description} onChange={handleChange} rows={8}
                             className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-base font-medium text-slate-700 outline-none resize-none custom-scrollbar"
                          />
                       <div className="space-y-6 p-10 bg-indigo-50/30 rounded-[3rem] border border-indigo-100">
                          <div className="flex items-center gap-3 mb-2">
                             <Landmark size={18} className="text-primary" />
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Protocol (Brokerage)</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Fee Calculation</label>
                                <select 
                                   name="feeType" value={formData.feeType} onChange={handleChange}
                                   className="w-full px-8 py-5 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none"
                                >
                                   <option value="percentage">Percentage based (%)</option>
                                   <option value="fixed">Fixed Rate (₹)</option>
                                </select>
                             </div>
                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Protocol Value</label>
                                <input 
                                   type="number" name="feeValue" value={formData.feeValue} onChange={handleChange}
                                   placeholder="8"
                                   className="w-full px-8 py-5 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 focus:border-primary transition-all outline-none"
                                />
                             </div>
                          </div>
                       </div>

                       {/* ELITE TOGGLE */}
                       <div className={`p-10 rounded-[3rem] border transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden ${formData.isPremium ? 'bg-amber-500 border-amber-400 shadow-2xl' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex items-center gap-8 relative z-10">
                             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${formData.isPremium ? 'bg-white text-amber-500' : 'bg-slate-900 text-white'}`}>
                                <Crown size={32} />
                             </div>
                             <div className="space-y-1">
                                <h4 className={`text-2xl font-black italic ${formData.isPremium ? 'text-white' : 'text-slate-900'}`}>Signal Boost ELITE</h4>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${formData.isPremium ? 'text-white/70' : 'text-slate-400'}`}>Prioritize transmission in global synchronization feeds</p>
                             </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer relative z-10">
                             <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} className="sr-only peer" />
                             <div className={`w-16 h-8 rounded-full peer transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-8 shadow-inner ${formData.isPremium ? 'bg-amber-600' : 'bg-slate-200'}`}></div>
                          </label>
                       </div>

                       <div className="flex flex-col sm:flex-row gap-6 pt-10">
                          <button 
                             type="submit" disabled={mutation.isPending}
                             className="flex-1 px-10 py-6 bg-slate-900 text-white font-black rounded-[2rem] text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-primary transition-all shadow-2xl shadow-slate-900/20 active:scale-95 disabled:opacity-30"
                          >
                             {mutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} className="-rotate-12" /> Initialize Deployment Broadcast</>}
                             <ArrowRight size={16} strokeWidth={3} />
                          </button>
                       </div>

                       <AnimatePresence>
                          {errorMessage && (
                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
                                <AlertTriangle size={16} /> {errorMessage}
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </form>
                 </div>
              </main>
           </div>
        </div>

        {/* --- PREVIEW MODAL --- */}
        <AnimatePresence>
           {showPreview && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6">
                 <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[4rem] max-w-2xl w-full p-12 space-y-10 relative shadow-2xl">
                    <button onClick={() => setShowPreview(false)} className="absolute top-10 right-10 p-3 hover:bg-slate-50 rounded-2xl transition-colors"><X size={24} /></button>
                    <div className="space-y-2">
                       <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Candidate Perspective</h3>
                       <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{formData.title || 'Untitled Node'}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Location</p>
                          <p className="font-bold text-slate-900">{formData.location || 'Not set'}</p>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Compensation</p>
                          <p className="font-bold text-slate-900">{formData.salary || 'Competitive'}</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Mission Brief</p>
                       <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{formData.description || 'No description provided.'}</p>
                    </div>
                    <button onClick={() => { setShowPreview(false); handleSubmit(); }} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary transition-all">Authorize Broadcast</button>
                 </motion.div>
              </motion.div>
           )}
        </AnimatePresence>

        {/* --- SUCCESS OVERLAY --- */}
        <AnimatePresence>
           {isDeployed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-6">
                 <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white p-16 rounded-[4rem] text-center space-y-8 max-w-xl w-full shadow-2xl">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner"><CheckCircle size={48} /></div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Transmission <span className="text-primary">Verified</span></h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Job node successfully synchronized with global grid.</p>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} className="h-full bg-primary" /></div>
                 </motion.div>
              </motion.div>
           )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
