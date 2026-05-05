import CompanyLayout from "../components/CompanyLayout";
import { 
  Plus, Users, Briefcase, TrendingUp, Calendar, MapPin, DollarSign, 
  LogOut, CheckCircle, XCircle, Search, Filter, Loader2, ArrowRight,
  Receipt, Download, CreditCard, Clock, Check, ShieldCheck, Radio,
  BarChart3, Zap, Globe, Cpu, ArrowUpRight, Target, Landmark, Activity,
  Settings, Building2, UserCircle, Save, Info, ExternalLink, Bell,
  ChevronLeft, ChevronRight, Sparkles, Database, Layers, PieChart as PieIcon,
  AlertCircle
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart as ReBarChart, Bar, Cell, PieChart, Pie, LineChart, Line
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { apiMock } from "../services/apiMock";
import { companyAPI, financialAPI, applicationsAPI, jobsAPI } from "../services/api";

export default function CompanyDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "pipeline";
  const setActiveTab = (newTab) => setSearchParams({ tab: newTab });

  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: statsData } = useQuery({
     queryKey: ['company-stats'],
     queryFn: async () => {
        try { return await companyAPI.getStats(); }
        catch (err) { return { activeJobs: 12, totalApplicants: 142, hiredCandidates: 8, commissionPaid: 45000 }; }
     },
     initialData: { activeJobs: 12, totalApplicants: 142, hiredCandidates: 8, commissionPaid: 45000 }
  });

  const { data: invoices } = useQuery({
     queryKey: ['company-invoices'],
     queryFn: async () => {
        try { return await financialAPI.getInvoices(); }
        catch (err) { return await apiMock.getFinancialLedger(); }
     },
     initialData: []
  });

  const { data: applicants, isLoading: loadingApps } = useQuery({
     queryKey: ['company-applicants'],
     queryFn: async () => {
        try { return await companyAPI.getApplicants(); }
        catch (err) { return []; }
     },
     initialData: []
  });

  const { data: companyJobs, isLoading: loadingJobs } = useQuery({
     queryKey: ['company-jobs'],
     queryFn: async () => {
        try { return await jobsAPI.getCompanyJobs(); }
        catch (err) { return []; }
     },
     initialData: []
  });

  const statusMutation = useMutation({
     mutationFn: async ({ appId, status }) => {
        return await applicationsAPI.updateStatus(appId, status);
     },
     onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['company-applicants'] });
     }
  });

  const kanbanStages = ["Applied", "Shortlisted", "Interview", "Selected", "Hired", "Rejected"];

  const showToast = (message, type = 'success') => {
     setToast({ message, type });
     setTimeout(() => setToast(null), 5000);
  };

  const handleAdvanceStage = (app, direction = 1) => {
     const currentIndex = kanbanStages.indexOf(app.status);
     const newIndex = currentIndex + direction;
     if (newIndex >= 0 && newIndex < kanbanStages.length) {
        const newStatus = kanbanStages[newIndex];
        statusMutation.mutate({ appId: app._id, status: newStatus });
        
        // Trigger automated brokerage notification when candidate is Selected
        if (newStatus === 'Selected' || newStatus === 'Hired') {
           showToast(`Candidate ${app.userId?.name || ''} selected! Brokerage fee invoice generated and sent to Admin.`, 'success');
           setTimeout(() => queryClient.invalidateQueries({ queryKey: ['company-invoices'] }), 1000);
        }
     }
  };

  const handlePayment = async (brokerageId) => {
     try {
        await financialAPI.payBrokerage(brokerageId);
        queryClient.invalidateQueries({ queryKey: ['company-invoices'] });
     } catch (err) {
        console.error('Payment protocol failure:', err);
     }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const pendingAmount = useMemo(() => 
    invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + (i.amount || 0), 0),
  [invoices]);

  const chartData = useMemo(() => {
    return [
      { name: 'Mon', rev: 4000, apps: 12 },
      { name: 'Tue', rev: 3000, apps: 19 },
      { name: 'Wed', rev: 2000, apps: 15 },
      { name: 'Thu', rev: 2780, apps: 22 },
      { name: 'Fri', rev: 1890, apps: 30 },
      { name: 'Sat', rev: 2390, apps: 25 },
      { name: 'Sun', rev: 3490, apps: 28 },
    ];
  }, []);

  return (
    <CompanyLayout>
      <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden font-body text-slate-900">
        <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
          
          {/* STICKY TOPBAR */}
          <header className="h-20 bg-white/80 backdrop-blur-xl sticky top-0 flex items-center justify-between px-8 shrink-0 z-40 border-b border-slate-200/40">
            <div className="flex items-center gap-6 w-1/3">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200/50 group focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all w-full max-w-sm">
                <Search className="text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Universal Search..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-sm text-slate-900 w-full focus:outline-none placeholder:text-slate-400 font-medium" 
                />
              </div>
            </div>
            
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 hidden lg:block">Company Dashboard</h2>

            <div className="flex items-center justify-end gap-6 w-1/3">
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all relative">
                  <Bell size={20} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
                </button>
                <button onClick={handleLogout} className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                  <LogOut size={20} />
                </button>
              </div>
              <div className="h-8 w-[1px] bg-slate-200" />
              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-slate-900 leading-none">Enterprise Root</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Node</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-black/10">C</div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar pb-20">
            <AnimatePresence mode="wait">
              {activeTab === 'pipeline' && (
                <motion.div key="pipeline" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  
                  {/* Main Grid: 2 columns (Left: 2/3, Right: 1/3) */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    
                    {/* TOP LEFT: Main Chart (Pipeline Overview) */}
                    <div className="xl:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col">
                       <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">Dashboard Overview</h3>
                          <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl">
                             <button className="px-4 py-1.5 bg-white text-primary text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">Applications</button>
                             <button className="px-4 py-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors">Brokerage</button>
                          </div>
                       </div>
                       <div className="flex-1 min-h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={chartData}>
                                <defs>
                                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#5956E9" stopOpacity={0.3} />
                                      <stop offset="95%" stopColor="#5956E9" stopOpacity={0} />
                                   </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} />
                                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="rev" stroke="#5956E9" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    {/* TOP RIGHT: Quick Actions */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
                       <div>
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Brokerage Gateway</h3>
                          <div className="space-y-5">
                             <div className="flex justify-between items-center pb-5 border-b border-slate-50">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Paid Brokerage</span>
                                <span className="text-sm font-black text-emerald-500">₹{(statsData.commissionPaid || 0).toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Sync</span>
                                <span className="text-sm font-black text-amber-500">₹{pendingAmount.toLocaleString()}</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="space-y-3 pt-6 border-t border-slate-50">
                          <button onClick={() => navigate('/post-job')} className="w-full py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-primary/30 flex justify-center items-center gap-2">
                             <Plus size={16} /> Post New Job
                          </button>
                       </div>
                    </div>
                  </div>

                  {/* Bottom Row Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    
                    {/* BOTTOM LEFT: Total Balance */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col">
                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          Total Brokerage Accrued <Info size={12}/>
                       </h3>
                       <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-8">₹{((statsData.commissionPaid || 0) + pendingAmount).toLocaleString()}</h2>
                       
                       <div className="flex gap-3 mb-8">
                          <button onClick={() => setActiveTab('billing')} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                             Settle Fees <ArrowRight size={14}/>
                          </button>
                       </div>
                       
                       <div className="mt-auto space-y-4">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-primary flex items-center justify-center"><Briefcase size={16}/></div>
                                <div>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Active Jobs</p>
                                </div>
                             </div>
                             <p className="text-sm font-black text-slate-900">{statsData.activeJobs}</p>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center"><Target size={16}/></div>
                                <div>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Candidates Selected</p>
                                </div>
                             </div>
                             <p className="text-sm font-black text-slate-900">{statsData.hiredCandidates}</p>
                          </div>
                       </div>
                    </div>

                    {/* BOTTOM MIDDLE: Small Chart (Job Insights) */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col">
                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Conversion Metrics</h3>
                       <div className="flex-1 min-h-[150px]">
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" hide />
                                <YAxis hide />
                                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="apps" stroke="#FF5B22" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                             </LineChart>
                          </ResponsiveContainer>
                       </div>
                       <div className="mt-6 flex items-center justify-between">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Applied</p>
                             <p className="text-xl font-black text-slate-900">{statsData.totalApplicants}</p>
                          </div>
                          <div className="h-8 w-[1px] bg-slate-100" />
                          <div className="space-y-1 text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversion</p>
                             <p className="text-xl font-black text-emerald-500">+{Math.round((statsData.hiredCandidates / (statsData.totalApplicants || 1)) * 100)}%</p>
                          </div>
                       </div>
                    </div>

                    {/* BOTTOM RIGHT: Recent Candidates Table */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col">
                       <div className="flex items-center justify-between mb-6">
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Candidates</h3>
                          <span className="text-[10px] font-bold text-slate-400">{applicants?.length || 0} Total</span>
                       </div>
                       <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[300px]">
                          {applicants?.slice(0, 10).map((app) => (
                             <div key={app._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-sm font-black text-primary uppercase shadow-inner">
                                      {app.userId?.name?.[0]}
                                   </div>
                                   <div>
                                      <p className="text-xs font-black text-slate-900 leading-tight">{app.userId?.name}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate max-w-[100px]">{app.jobId?.title}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-3">
                                   <div className="text-right hidden sm:block">
                                      <p className={`text-[9px] font-black uppercase tracking-widest ${app.status === 'Selected' || app.status === 'Hired' ? 'text-emerald-500' : 'text-primary'}`}>
                                         {app.status}
                                      </p>
                                   </div>
                                   {app.status !== 'Selected' && app.status !== 'Hired' && app.status !== 'Rejected' ? (
                                      <button 
                                         onClick={() => handleAdvanceStage(app, 1)} 
                                         className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-primary shadow-lg shadow-black/10"
                                         title="Advance to next stage"
                                      >
                                         <Check size={14}/>
                                      </button>
                                   ) : (
                                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 opacity-0 group-hover:opacity-100 transition-all">
                                         <ShieldCheck size={14}/>
                                      </div>
                                   )}
                                </div>
                             </div>
                          ))}
                          {(!applicants || applicants.length === 0) && (
                             <div className="text-center py-12 flex flex-col items-center">
                                <Users size={32} className="text-slate-200 mb-3" />
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No Active Candidates</p>
                             </div>
                          )}
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'billing' && (
                <motion.div key="billing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                   <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Settlement <span className="text-primary">Registry</span></h2>
                   <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden">
                      <table className="w-full text-left">
                         <thead className="bg-slate-900 text-white">
                            <tr>
                               {["Node ID", "Candidate", "Value", "Status", "Action"].map(h => (
                                 <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">{h}</th>
                               ))}
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {invoices.map((inv, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-all">
                                 <td className="px-8 py-6 text-xs font-bold text-slate-900">#{inv.invoiceId?.slice(-6).toUpperCase()}</td>
                                 <td className="px-8 py-6 text-xs font-bold text-slate-600">{inv.candidateId?.name || "Global Talent"}</td>
                                 <td className="px-8 py-6 text-sm font-black italic text-slate-900">₹{(inv.amount || 0).toLocaleString()}</td>
                                 <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{inv.status}</span>
                                 </td>
                                 <td className="px-8 py-6">
                                    {inv.status !== 'Paid' && <button onClick={() => handlePayment(inv._id)} className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg hover:bg-primary transition-all">Settle</button>}
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-10 w-full">
                   <div className="bg-white rounded-[4rem] p-16 border border-slate-100 shadow-premium space-y-12">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Corporate <span className="text-primary">Identity</span></h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
                               <input type="text" defaultValue="JobGrox Enterprise" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all" />
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'vacancies' && (
                <motion.div key="vacancies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                   <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Active <span className="text-primary">Vacancies</span></h2>
                      <button onClick={() => navigate('/post-job')} className="px-6 py-3 bg-primary text-white text-xs font-black uppercase rounded-xl hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                         <Plus size={16} /> Post New Job
                      </button>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-6">
                      {loadingJobs ? (
                         <div className="p-8 text-center text-slate-400"><Loader2 className="animate-spin mx-auto mb-2" /> Loading Vacancies...</div>
                      ) : companyJobs.length > 0 ? (
                         companyJobs.map(job => (
                            <div key={job._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-lg transition-all group">
                               <div className="flex items-center gap-6">
                                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100 group-hover:scale-110 transition-transform"><Briefcase size={28}/></div>
                                  <div>
                                     <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                                     <div className="flex items-center gap-4 mt-2">
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><MapPin size={12} className="text-primary"/> {job.location}</span>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><DollarSign size={12} className="text-primary"/> {job.salary}</span>
                                     </div>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  <div className="text-right">
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                                     <p className={`text-xs font-black uppercase tracking-widest ${job.approvalStatus === 'Approved' ? 'text-emerald-500' : 'text-amber-500'}`}>{job.approvalStatus || 'Pending'}</p>
                                  </div>
                               </div>
                            </div>
                         ))
                      ) : (
                         <div className="bg-white p-16 rounded-[3rem] border border-slate-100 shadow-sm text-center">
                            <Briefcase size={40} className="mx-auto text-slate-200 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">No active vacancies</h3>
                            <p className="text-slate-500 text-sm mt-2">Create your first job posting to start receiving applicants.</p>
                         </div>
                      )}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Toast Notification System */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-50 p-5 rounded-2xl shadow-2xl border flex items-center gap-4 max-w-md ${
              toast.type === 'success' ? 'bg-white border-emerald-100' : 'bg-white border-rose-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              toast.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
            }`}>
              {toast.type === 'success' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">System Notification</p>
              <p className="text-sm font-bold text-slate-900 leading-snug">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-900 transition-colors">
              <XCircle size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </CompanyLayout>
  );
}
