import { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { 
  Search, Users, Filter, Star, MapPin, Briefcase, Mail, Phone,
  ChevronRight, ArrowUpRight, Sparkles, Target, Activity, 
  Layers, Database, ShieldCheck, Download, MoreHorizontal,
  Plus, MessageSquare, Zap, BarChart3, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../services/api';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await adminAPI.getAllUsers();
        // Filter out admins
        const filtered = data.filter(u => u.role !== 'admin');
        setCandidates(filtered);
        if (filtered.length > 0) setSelectedCandidate(filtered[0]);
      } catch (err) {
        console.error("Talent discovery failure:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [candidates, searchQuery]);

  if (loading) return (
    <Layout>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Talent Nodes...</p>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-white flex flex-col font-body text-slate-900">
        
        {/* TOP COMMAND BAR */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-xl bg-white/80">
          <div className="flex items-center gap-6 w-1/3">
             <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all w-full max-w-sm group">
                <Search className="text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                   type="text" 
                   placeholder="Universal Talent Search..." 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="bg-transparent border-none text-sm text-slate-900 w-full focus:outline-none placeholder:text-slate-400 font-bold"
                />
             </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
             <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
                <Users size={20} />
             </div>
             <h2 className="text-sm font-black uppercase tracking-[0.4em] italic">Talent <span className="text-primary">Registry</span></h2>
          </div>

          <div className="flex items-center justify-end gap-4 w-1/3">
             <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all">
                <Plus size={14} /> Import Node
             </button>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          
          {/* LEFT: RESULTS COLUMN */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#F8FAFC]/50">
             <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                     { label: 'Total Nodes', val: candidates.length, icon: Database, color: 'text-indigo-500' },
                     { label: 'Active Signals', val: '42', icon: Activity, color: 'text-emerald-500' },
                     { label: 'Neural Matches', val: '18', icon: Sparkles, color: 'text-primary' }
                   ].map((s, i) => (
                     <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-white shadow-premium relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10 flex items-center gap-4">
                           <div className={`p-3 rounded-2xl bg-slate-50 ${s.color}`}><s.icon size={22} /></div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                              <p className="text-xl font-black italic tracking-tighter">{s.val}</p>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="flex items-center justify-between px-4">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Discovered Entities ({filteredCandidates.length})</h3>
                   <div className="flex gap-2">
                      <button className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all shadow-sm"><Filter size={16}/></button>
                   </div>
                </div>

                {/* Candidate Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                   <AnimatePresence mode="popLayout">
                      {filteredCandidates.map((c) => (
                        <motion.div 
                           layout
                           key={c._id}
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           onClick={() => setSelectedCandidate(c)}
                           className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${
                              selectedCandidate?._id === c._id 
                                 ? "bg-primary border-primary shadow-[0_20px_50px_-10px_rgba(89,86,233,0.3)] text-white" 
                                 : "bg-white border-white shadow-premium hover:border-primary/20"
                           }`}
                        >
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                           <div className="flex items-center gap-4 mb-6 relative z-10">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner uppercase ${selectedCandidate?._id === c._id ? 'bg-white/20' : 'bg-slate-50 text-indigo-600'}`}>
                                 {c.name?.[0]}
                              </div>
                              <div className="min-w-0">
                                 <h4 className={`font-black text-lg leading-tight truncate ${selectedCandidate?._id === c._id ? 'text-white' : 'text-slate-900'}`}>{c.name}</h4>
                                 <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${selectedCandidate?._id === c._id ? 'text-white/60' : 'text-slate-400'}`}>{c.email}</p>
                              </div>
                           </div>

                           <div className="space-y-4 relative z-10">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                 <span className={selectedCandidate?._id === c._id ? 'text-white/60' : 'text-slate-400'}>Neural Rank</span>
                                 <span className={selectedCandidate?._id === c._id ? 'text-white' : 'text-primary'}>Elite Node</span>
                              </div>
                              <div className={`w-full h-1.5 rounded-full overflow-hidden ${selectedCandidate?._id === c._id ? 'bg-white/10' : 'bg-slate-50'}`}>
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '85%' }}
                                    className={`h-full ${selectedCandidate?._id === c._id ? 'bg-white' : 'bg-primary'}`}
                                 />
                              </div>
                              <div className="flex gap-2 pt-2">
                                 <button className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedCandidate?._id === c._id ? 'bg-white text-primary' : 'bg-slate-900 text-white hover:bg-primary'}`}>Audit Dossier</button>
                                 <button className={`p-3 rounded-xl transition-all ${selectedCandidate?._id === c._id ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400 hover:text-primary border border-slate-100'}`}><MessageSquare size={16}/></button>
                              </div>
                           </div>
                        </motion.div>
                      ))}
                   </AnimatePresence>
                </div>
             </div>
          </div>

          {/* RIGHT: DETAILS PANEL */}
          <aside className="w-[450px] bg-white border-l border-slate-100 p-10 overflow-y-auto hidden xl:block custom-scrollbar">
             <AnimatePresence mode="wait">
                {selectedCandidate ? (
                   <motion.div 
                      key={selectedCandidate._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-12"
                   >
                      <div className="text-center space-y-6">
                         <div className="relative inline-block">
                            <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-3xl shadow-xl border-4 border-white uppercase mx-auto">
                               {selectedCandidate.name?.[0]}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                               <ShieldCheck size={14} />
                            </div>
                         </div>
                         <div>
                            <h3 className="text-2xl font-black tracking-tighter italic">{selectedCandidate.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">{selectedCandidate.role} Terminal</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-slate-50 rounded-2xl space-y-1 text-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase">Experience</p>
                            <p className="text-sm font-black italic">{selectedCandidate.experience || 5}+ Years</p>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl space-y-1 text-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase">Success Rate</p>
                            <p className="text-sm font-black italic text-emerald-600">92%</p>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Target size={14} className="text-primary" /> Neural Skill Lattice
                         </h4>
                         <div className="flex flex-wrap gap-2">
                            {['System Architecture', 'Cloud Infrastructure', 'Deep Learning', 'Quantum Logic', 'Node Strategy'].map((s, i) => (
                               <span key={i} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black shadow-sm group hover:border-primary transition-all cursor-default">{s}</span>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp size={14} className="text-primary" /> Market Pulse
                         </h4>
                         <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] -mr-16 -mt-16" />
                            <div className="relative z-10 space-y-4">
                               <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                                  <span>Visibility Signal</span>
                                  <span className="text-primary">+24%</span>
                               </div>
                               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="w-[78%] h-full bg-primary shadow-[0_0_10px_#5956E9]" />
                               </div>
                               <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">"Candidate shows high probability for Senior Leadership nodes within Q3 cycles."</p>
                            </div>
                         </div>
                      </div>

                      <div className="pt-8 border-t border-slate-50 flex gap-3">
                         <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/10">Authorize Sync</button>
                         <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-rose-500 border border-slate-100 transition-all"><MoreHorizontal size={20}/></button>
                      </div>
                   </motion.div>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-6">
                      <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300"><Layers size={48} /></div>
                      <div>
                         <p className="text-sm font-black uppercase tracking-[0.2em]">Neutral State</p>
                         <p className="text-xs font-bold mt-2">Select a talent node to initialize analysis.</p>
                      </div>
                   </div>
                )}
             </AnimatePresence>
          </aside>
        </main>
      </div>
    </Layout>
  );
}
