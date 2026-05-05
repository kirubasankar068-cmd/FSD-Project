import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useMutation } from '@tanstack/react-query';
import { Layers, ArrowRight, CheckCircle, AlertCircle, Zap, Search, Target, TrendingUp, Cpu, BookOpen, Clock, Loader2, Sparkles, Award, Activity, BarChart3, Globe2, Banknote, ShieldAlert, LineChart } from 'lucide-react';
import { apiMock } from '../services/apiMock';
import { aiAPI, authAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const analyzeFn = async ({ userSkillsArray, targetRole }) => {
  try {
    const data = await aiAPI.analyze(userSkillsArray, targetRole);
    
    // The backend lacks radarData, we synthesize it on the frontend for the v2 UI
    if (!data.radarData) {
        data.radarData = [
           { subject: 'Core Frameworks', userScore: Math.min(100, (data.matchedSkills?.length || 0) * 30 + 10), required: 90 },
           { subject: 'Cloud & Deploy', userScore: (data.phases?.phase2?.length || 0) < 3 ? 85 : 30, required: 85 },
           { subject: 'Architecture', userScore: (data.phases?.phase3?.length || 0) < 3 ? 80 : 20, required: 95 },
           { subject: 'System Design', userScore: (data.matchPercentage || 0) > 80 ? 90 : 40, required: 80 },
           { subject: 'Tooling & CI/CD', userScore: (data.matchPercentage || 0) > 60 ? 75 : 35, required: 70 },
        ];
    }
    return data;
  } catch (err) {
    console.error("Skill Analyzer Error:", err);
    throw new Error("Unable to analyze matrices due to neural engine offline.");
  }
};

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", 
  "Data Scientist", "DevOps Specialist", "Cybersecurity Analyst", 
  "UI/UX Designer", "Mobile App Developer", "Cloud Architect", 
  "Product Manager", "Database Administrator", "QA Automation Engineer", 
  "Machine Learning Engineer", "Solutions Architect"
];

export default function SkillAnalyzer() {
  const [role, setRole] = useState('Frontend Developer');
  const [userSkillsInput, setUserSkillsInput] = useState('React, HTML, CSS');
  const [syncLoading, setSyncLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: analyzeFn,
  });

  const syncWithResume = async () => {
    setSyncLoading(true);
    try {
       const userData = await authAPI.getCurrentUser();
       const skills = userData.resumeData?.skills || userData.skills || [];
       
       if (skills.length > 0) {
          setUserSkillsInput(skills.join(', '));
          // Suggested role logic
          if (userData.resumeData?.title) {
            const matchedRole = ROLES.find(r => r.toLowerCase().includes(userData.resumeData.title.toLowerCase()));
            if (matchedRole) setRole(matchedRole);
          }
       }
    } catch (err) {
       console.error('Core Sync Failure:', err);
    } finally {
       setSyncLoading(false);
    }
  };

  const handleAnalyze = () => {
    if (!userSkillsInput.trim()) return;
    const skillsArray = userSkillsInput.split(',').map(s => s.trim()).filter(s => s);
    mutation.mutate({ userSkillsArray: skillsArray, targetRole: role });
  };

  const analysis = mutation.data;

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto space-y-10 pb-20">
        
        {/* Advanced Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 lg:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000"></div>
           <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                    <TrendingUp size={20} />
                 </div>
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Advanced Skill Protocol</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">Skill Analyzer <span className="text-indigo-600">v2.0</span></h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Neural Gap Analysis • Industry Benchmarking • Priority Career Mapping</p>
           </div>
           
           <button 
             onClick={syncWithResume}
             disabled={syncLoading}
             className="px-10 py-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-100 transition-all flex items-center gap-4 relative z-10 active:scale-95 group"
           >
             {syncLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />}
             Sync Intelligence Map
           </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 {/* Section: Config Area - Redesigned for "Neat Look" */}
          <div className="lg:col-span-5 flex flex-col h-full">
             <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
                {/* Internal Card Header */}
                <div className="p-8 lg:p-10 border-b border-slate-50 space-y-2">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Configuration Matrix</h2>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Establish Input Parameters for Neural Mapping</p>
                </div>

                <div className="p-8 lg:p-10 flex-1 space-y-10">
                   <div className="space-y-8">
                      {/* Role Selector */}
                      <div className="space-y-3">
                         <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Professional Role</label>
                            <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">REQUIRED</span>
                         </div>
                         <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all">
                               <Target size={16} />
                            </div>
                            <select 
                               value={role} 
                               onChange={(e) => setRole(e.target.value)}
                               className="w-full pl-16 pr-6 h-[70px] bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-600 transition-all appearance-none cursor-pointer"
                            >
                               {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                               <Search size={16} />
                            </div>
                         </div>
                      </div>

                      {/* Skills Inventory */}
                      <div className="space-y-3">
                         <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill Inventory (Comma Separated)</label>
                            <div className="flex items-center gap-2">
                               <Zap size={10} className="text-amber-500" />
                               <span className="text-[10px] font-black text-indigo-500">{userSkillsInput.split(',').filter(s => s.trim()).length} Active Nodes</span>
                            </div>
                         </div>
                         <div className="relative">
                            <textarea 
                               value={userSkillsInput}
                               onChange={(e) => setUserSkillsInput(e.target.value)}
                               className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-600 transition-all resize-none min-h-[250px] leading-relaxed"
                               placeholder="e.g. Node.js, AWS, Kubernetes, etc."
                            />
                            <div className="absolute bottom-6 right-6 opacity-20">
                               <Cpu size={24} className="text-slate-400" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Integrated Action Area */}
                <div className="p-8 lg:p-10 bg-slate-50/50 border-t border-slate-100">
                   <button 
                      onClick={handleAnalyze}
                      disabled={mutation.isPending}
                      className="w-full h-[75px] bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-indigo-600 hover:shadow-indigo-200 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.25em] group"
                   >
                      {mutation.isPending ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <Zap size={18} fill="currentColor" className="text-amber-400 group-hover:scale-125 transition-transform" />
                          Engage Neural Analysis
                        </>
                      )}
                   </button>
                </div>
             </div>
          </div>
 
          {/* Section: Intelligence Abstract Area */}
          <div className="lg:col-span-7 flex flex-col h-full">
             <div className="bg-slate-50 border border-slate-100 rounded-[3.5rem] p-10 lg:p-14 h-full flex flex-col space-y-12">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Abstract</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Mapping Data Stream</p>
                   </div>
                   {analysis && (
                     <span className="text-[10px] font-bold text-white bg-slate-900 px-4 py-1.5 rounded-lg uppercase tracking-wider">{analysis.seniority} MATCH</span>
                   )}
                </div>

                {!analysis && !mutation.isPending ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 py-12">
                      <div className="relative group">
                         <div className="absolute inset-0 bg-indigo-500/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                         <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-200 shadow-2xl border border-slate-50 relative z-10">
                            <Search size={48} strokeWidth={1.5} className="group-hover:scale-110 group-hover:text-indigo-600 transition-all duration-700" />
                         </div>
                         <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                             <Cpu size={20} />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">No Matrix Loaded</h3>
                         <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] max-w-[320px] mx-auto leading-relaxed">
                            Establish a <span className="text-indigo-600">carrier signal</span> by entering your professional skills and defining a target role in the console.
                         </p>
                      </div>
                      <div className="flex gap-2">
                         {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>)}
                      </div>
                   </div>
                ) : mutation.isPending ? (
                   <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-10">
                      <div className="relative">
                         <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                         <Cpu className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={32} />
                      </div>
                      <div className="space-y-3 text-center">
                         <p className="text-slate-900 font-black text-xl tracking-tight uppercase animate-pulse">Processing Carrier Map...</p>
                         <div className="flex gap-2">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></span>
                         </div>
                      </div>
                   </div>
                ) : (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="space-y-12 h-full flex flex-col"
                   >
                      {/* Convergence Statistics & Radar */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <div className="p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-indigo-100/50 flex flex-col items-center sm:flex-row sm:items-start gap-10">
                            <div className="relative w-32 h-32 flex-shrink-0">
                               <svg className="w-full h-full -rotate-90">
                                 <circle cx="64" cy="64" r="54" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                                 <circle 
                                    cx="64" cy="64" r="54" fill="none" stroke="var(--primary)" strokeWidth="12" 
                                    strokeDasharray="339.29" strokeDashoffset={339.29 - (339.29 * analysis.matchPercentage) / 100}
                                    className="transition-all duration-1500 ease-out"
                                    strokeLinecap="round"
                                 />
                               </svg>
                               <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{analysis.matchPercentage}%</span>
                               </div>
                            </div>
                            <div className="space-y-3 text-center sm:text-left">
                               <h3 className="text-xl font-bold text-slate-900 tracking-tight">Synchronization Score</h3>
                               <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[250px]">{analysis.summary}</p>
                            </div>
                         </div>
                         
                         {/* Radar Chart */}
                         <div className="p-8 bg-slate-900 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <div className="mb-4 relative z-10">
                               <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2"><Activity size={18} className="text-indigo-400" /> Vector Analysis</h3>
                               <p className="text-slate-400 text-xs font-medium">User Profile vs Required Baseline</p>
                            </div>
                            <div className="flex-1 min-h-[180px] w-full relative z-10 -mt-4">
                               <ResponsiveContainer width="100%" height="100%">
                                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={analysis.radarData}>
                                     <PolarGrid stroke="#334155" />
                                     <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 'bold'}} />
                                     <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                     <Radar name="Your Score" dataKey="userScore" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                                     <Radar name="Required" dataKey="required" stroke="#cbd5e1" fill="transparent" strokeDasharray="3 3" />
                                     <RechartsTooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '12px'}} />
                                  </RadarChart>
                               </ResponsiveContainer>
                            </div>
                         </div>
                      </div>

                      {/* Phased Neural Roadmap */}
                      <div className="flex-1 space-y-10 bg-white rounded-[3.5rem] p-10 lg:p-12 border border-slate-100 shadow-sm overflow-y-auto custom-scrollbar max-h-[600px] pb-20">
                         <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3"><Layers size={20} className="text-indigo-600" /> Career Roadmap</h3>
                            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md">ACTIVE</div>
                         </div>

                         <div className="space-y-0 mt-8">
                            {/* Phase 1: Core */}
                            <div className="flex gap-6 group">
                               <div className="flex flex-col items-center">
                                  <div className="w-12 h-12 shrink-0 bg-white border-4 border-indigo-600 rounded-2xl flex items-center justify-center text-indigo-600 font-black shadow-xl">1</div>
                                  <div className="w-1 flex-1 bg-indigo-100 my-2 rounded-full group-hover:bg-indigo-300 transition-colors"></div>
                               </div>
                               <div className="pb-10 flex-1 space-y-3 mt-1 min-w-0">
                                  <div className="space-y-1">
                                     <h4 className="text-lg font-bold text-slate-900 tracking-tight">Current Competency</h4>
                                     <p className="text-xs font-medium text-slate-400">Core Skills Matched</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2 pt-2">
                                     {analysis.phases.phase1.length > 0 ? analysis.phases.phase1.map(node => (
                                       <span key={node} className="px-4 py-2 bg-slate-900 text-white text-[11px] font-semibold rounded-xl border border-slate-800 shadow-sm">{node}</span>
                                     )) : <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2"><CheckCircle size={14} /> CORE_SYNC_COMPLETE</span>}
                                  </div>
                               </div>
                            </div>

                            {/* Phase 2: Professional */}
                            <div className="flex gap-6 group">
                               <div className="flex flex-col items-center">
                                  <div className="w-12 h-12 shrink-0 bg-white border-4 border-slate-200 group-hover:border-indigo-400 rounded-2xl flex items-center justify-center text-slate-400 font-black shadow-none transition-colors">2</div>
                                  <div className="w-1 flex-1 bg-slate-100 my-2 rounded-full group-hover:bg-slate-200 transition-colors"></div>
                               </div>
                               <div className="pb-10 flex-1 space-y-3 mt-1 min-w-0">
                                  <div className="space-y-1">
                                     <h4 className="text-lg font-bold text-slate-900 tracking-tight">Required Expertise</h4>
                                     <p className="text-xs font-medium text-slate-400">Skills Needed for Target Role</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2 pt-2">
                                     {analysis.phases.phase2.length > 0 ? analysis.phases.phase2.map(node => (
                                       <span key={node} className="px-4 py-2 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded-xl border border-slate-200">{node}</span>
                                     )) : <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2"><CheckCircle size={14} /> PROF_SYNC_COMPLETE</span>}
                                  </div>
                               </div>
                            </div>

                            {/* Phase 3: Mastery */}
                            <div className="flex gap-6 group">
                               <div className="flex flex-col items-center">
                                  <div className="w-12 h-12 shrink-0 bg-white border-4 border-slate-50 group-hover:border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 font-black shadow-none transition-colors">3</div>
                                  <div className="w-1 flex-1 bg-transparent my-2 rounded-full"></div>
                               </div>
                               <div className="pb-4 flex-1 space-y-3 mt-1 min-w-0">
                                  <div className="space-y-1">
                                     <h4 className="text-lg font-bold text-slate-900 tracking-tight">Advanced Mastery</h4>
                                     <p className="text-xs font-medium text-slate-400">Long-term Optimization Focus</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2 pt-2">
                                     {analysis.phases.phase3.length > 0 ? analysis.phases.phase3.map(node => (
                                       <span key={node} className="px-4 py-2 bg-white text-slate-400 text-[11px] font-semibold rounded-xl border border-slate-100 shadow-sm">{node}</span>
                                     )) : <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2"><CheckCircle size={14} /> MASTER_SYNC_COMPLETE</span>}
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* ── ADVANCED FEATURE: SKILL MARKET ARBITRAGE ── */}
                      <div className="bg-white rounded-[3.5rem] border border-slate-100 p-10 lg:p-12 shadow-sm space-y-10 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                         
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-1">
                               <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">
                                  <Banknote size={14} /> Market Arbitrage Engine
                               </div>
                               <h3 className="text-3xl font-black text-slate-900 tracking-tight">Learning ROI & Scarcity</h3>
                               <p className="text-slate-500 font-medium">Predicting financial delta from skill acquisition.</p>
                            </div>
                            <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                               <Globe2 size={14} className="text-emerald-400" /> Global Data v2
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            {(analysis.phases.phase2.slice(0, 3)).map((skill, i) => (
                               <div key={skill} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-6 hover:shadow-xl hover:-translate-y-1 transition-all">
                                  <div className="flex justify-between items-start">
                                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600 font-black">
                                        {i + 1}
                                     </div>
                                     <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Pay</p>
                                        <p className="text-lg font-black text-emerald-600">+$12k - 18k</p>
                                     </div>
                                  </div>
                                  
                                  <div className="space-y-1">
                                     <h4 className="text-xl font-black text-slate-900 tracking-tight">{skill}</h4>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Demand / Low Supply</p>
                                  </div>

                                  <div className="space-y-3">
                                     <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Scarcity Index</span>
                                        <span className="text-indigo-600">8.4/10</span>
                                     </div>
                                     <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: "84%" }}
                                          className="h-full bg-indigo-500"
                                        />
                                     </div>
                                  </div>

                                  <div className="pt-4 flex items-center gap-2 text-xs font-bold text-slate-700">
                                     <LineChart size={14} className="text-emerald-500" />
                                     <span>ROI: 320% in 6 months</span>
                                  </div>
                               </div>
                            ))}
                         </div>

                         <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-6">
                               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl border border-indigo-100">
                                  <ShieldAlert size={32} />
                               </div>
                               <div className="space-y-1">
                                  <h4 className="text-xl font-black text-slate-900 tracking-tight">Priority Learning Path</h4>
                                  <p className="text-xs font-medium text-slate-500">Highest financial impact identified in {analysis.phases.phase2[0] || 'Cloud Infrastructure'}.</p>
                                </div>
                            </div>
                            <button className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all uppercase tracking-widest text-[10px] shadow-xl">
                               Activate Fast-Track
                            </button>
                         </div>
                      </div>

                      {/* Expertise Transmision Panel */}
                      <div className="space-y-8 pt-10 border-t border-slate-100">
                         <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">Recommended Courses <Clock size={12} /></h4>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md uppercase">Curated For You</span>
                         </div>
                         <div className="grid grid-cols-1 gap-6">
                            {analysis.recommendedAcademy?.map((match, i) => (
                               <motion.div 
                                 key={i} 
                                 whileHover={{ y: -5 }}
                                 className="px-10 py-10 bg-white border border-slate-100 rounded-[3rem] shadow-3xl shadow-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-10 hover:border-indigo-600 transition-all cursor-default group"
                               >
                                  <div className="flex items-center gap-10 w-full">
                                     <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-[1.8rem] flex items-center justify-center text-indigo-600 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                        <BookOpen size={34} />
                                     </div>
                                     <div className="space-y-1 flex-1">
                                         <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{match.skill} Track</span>
                                            <div className={`px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-md uppercase`}>{match.course.level}</div>
                                         </div>
                                         <h5 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">{match.course.title}</h5>
                                         <p className="text-xs font-medium text-slate-500 pt-1">{match.course.provider} • {match.course.duration}</p>
                                     </div>
                                  </div>
                                  <a href={match.link} target="_blank" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl flex items-center justify-center gap-3 group/btn">
                                     Enroll <ArrowRight size={16} className="group-hover/btn:translate-x-3 transition-transform" />
                                  </a>
                               </motion.div>
                            ))}
                         </div>
                      </div>
                   </motion.div>
                )}
             </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

// Layout for pages
SkillAnalyzer.getLayout = (page) => <Layout>{page}</Layout>;
