import { useState, useEffect, useMemo } from "react"; // Neural Network Root
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  LayoutDashboard, Briefcase, Package, Users, ShoppingBag, Wallet, Settings, 
  AlertCircle, Building2, LogOut, Bell, Search, ArrowUpRight, ArrowDownRight, 
  Plus, DollarSign, TrendingUp, Activity, ShieldCheck, Ban, Filter, Sparkles,
  Landmark, Database, Cpu, ChevronDown, ChevronRight, ChevronLeft, FileText, 
  LayoutTemplate, Layers, Zap, Globe, Target, XCircle,
  Download
} from "lucide-react";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { adminAPI, financialAPI } from "../services/api";
import AdminLayout from "../components/AdminLayout";

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";
  const setTab = (newTab) => setSearchParams({ tab: newTab });

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, companies: 0, jobs: 0 });
  const [ledger, setLedger] = useState([]);
  const [analytics, setAnalytics] = useState({ stats: [], topCompanies: [] });
  const [allUsers, setAllUsers] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState("job"); // 'job' or 'company'
  const [searchJobs, setSearchJobs] = useState("");
  const [searchUsers, setSearchUsers] = useState("");
  const [searchCompanies, setSearchCompanies] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const [s, u, j, l, a, n] = await Promise.all([
        adminAPI.getStats(), adminAPI.getAllUsers(), adminAPI.getAllJobs(),
        financialAPI.getLedger(), financialAPI.getAnalytics(), adminAPI.getNotifications()
      ]);
      setStats(s); setAllUsers(u); setAllJobs(j); setLedger(l); setAnalytics(a); setNotifications(n || []);
    } catch (e) { 
      console.error(">> LOAD_FAILURE:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleBan = async (id) => {
    try {
      await adminAPI.banUser(id);
      load();
    } catch (e) {}
  };

  const handleDeleteUser = async (id) => {
    if(!confirm("Delete user?")) return;
    try {
      await adminAPI.deleteUser(id);
      load();
    } catch (e) {}
  };

  const handleApproveJob = async (id) => {
    try {
      await adminAPI.approveJob(id);
      load();
    } catch (e) {}
  };

  const handleRejectJob = async (id) => {
    try {
      await adminAPI.rejectJob(id);
      load();
    } catch (e) {}
  };

  const handleSettle = async (id) => {
    try {
      await financialAPI.updateBrokerage(id, { status: "Paid" });
      load();
    } catch (e) {}
  };

  const handleApproveCompany = async (id) => {
    try {
      await adminAPI.verifyCompany(id, { isVerified: true });
      load();
    } catch (e) {}
  };

  const handleDeleteCompany = async (id) => {
    if(!confirm("Delete company?")) return;
    try {
      await adminAPI.deleteCompany(id);
      load();
    } catch (e) {}
  };

  useEffect(() => { 
    load(); 
    const t = setInterval(load, 30000); 
    return () => clearInterval(t); 
  }, []);

  const paid = useMemo(() => ledger.filter(x => x.status === "Paid"), [ledger]);
  const totalRev = useMemo(() => paid.reduce((s, x) => s + (x.amount || 0), 0), [paid]);
  const pending = useMemo(() => ledger.reduce((s, x) => x.status === "Pending" ? s + (x.amount || 0) : s, 0), [ledger]);

  const revenueData = useMemo(() => {
    if (!analytics?.stats) return [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return analytics.stats.map(s => ({ name: months[s._id - 1], rev: s.totalRevenue }));
  }, [analytics]);

  const salesData = useMemo(() => {
    if (!analytics?.stats) return [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return analytics.stats.map(s => ({ name: months[s._id - 1], sales: s.count }));
  }, [analytics]);

  const handleCreateSettlement = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
        companyId: form.companyId.value,
        candidateId: (form.candidateId && form.candidateId.value !== "") ? form.candidateId.value : null,
        amount: parseFloat(form.amount.value),
        feeType: form.feeType ? form.feeType.value : "fixed",
        feeValue: form.feeValue ? parseFloat(form.feeValue.value) : parseFloat(form.amount.value),
        status: "Pending"
    };
    try {
       await financialAPI.createSettlement(data);
       setShowCreateModal(false);
       load();
    } catch (e) {
       console.error(">> SYNC_ERROR:", e);
       alert(`Failed to synchronize record: ${e.message}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse mx-auto" />
          <div className="absolute inset-0 w-16 h-16 border-t-4 border-primary rounded-full animate-spin mx-auto" />
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Synchronizing Neural Network...</p>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-10 pb-20">
            <AnimatePresence mode="wait">
              {tab === "dashboard" && (
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-10">
                   <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
                <div className="space-y-1">
                   <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none">Command <span className="text-primary">Center</span></h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Global Node Performance & Financial Registry</p>
                </div>
                <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100/50">
                   <div className="relative">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                      <div className="w-2 h-2 bg-emerald-500 rounded-full absolute inset-0" />
                   </div>
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Link Active</span>
                </div>
             </div>

                   {/* Stats Grid */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      {[
                        { label: "Revenue Cleared", val: `₹${totalRev.toLocaleString()}`, icon: DollarSign, trend: "+14.2%", up: true, bg: "admin-card-dark" },
                        { label: "Active Talent", val: stats.users, icon: Users, trend: "+8 Nodes", up: true, bg: "bg-white" },
                        { label: "Job Nodes", val: stats.jobs, icon: Briefcase, trend: "+23.1%", up: true, bg: "bg-white" },
                        { label: "Enterprise Partners", val: stats.companies, icon: Building2, trend: "Stable", up: true, bg: "bg-white" }
                      ].map((s, i) => (
                        <div key={i} className={`${s.bg} p-6 md:p-8 rounded-[2rem] border border-white shadow-premium group hover-lift relative overflow-hidden flex flex-col justify-between min-h-[160px]`}>
                           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                           <div className="relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                 <div className={`p-2.5 rounded-xl shadow-sm ${s.bg === 'admin-card-dark' ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-900'}`}>
                                    <s.icon size={20} />
                                 </div>
                                 <div className={`text-[8px] font-black px-2 py-1 rounded-md tracking-wider ${s.up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {s.trend}
                                 </div>
                              </div>
                              <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${s.bg === 'admin-card-dark' ? 'text-white/60' : 'text-slate-400'}`}>{s.label}</p>
                              <h3 className={`text-2xl font-black italic tracking-tighter leading-none ${s.bg === 'admin-card-dark' ? 'text-white' : 'text-slate-900'}`}>{s.val}</h3>
                           </div>
                        </div>
                      ))}
                   </div>
                   
                   {/* Main Analytics Row */}
                   <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-10">
                      <div className="xl:col-span-8 bg-white rounded-[3rem] p-6 md:p-10 border border-slate-100 shadow-premium">
                         <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-slate-900 italic">Financial <span className="text-primary">Vector</span></h3>
                            <div className="flex gap-2">
                               <button className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-black/10">Revenue</button>
                               <button className="px-5 py-2.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-slate-100 transition-colors">Node Growth</button>
                            </div>
                         </div>
                         <div className="h-[350px] md:h-[450px]">
                            <ResponsiveContainer width="100%" height="100%">
                               <AreaChart data={revenueData}>
                                  <defs>
                                     <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5956E9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#5956E9" stopOpacity={0} />
                                     </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:800, fill:'#94a3b8'}} dy={10} />
                                  <YAxis axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:800, fill:'#94a3b8'}} />
                                  <Tooltip contentStyle={{borderRadius:'20px', border:'none', boxShadow:'0 20px 40px rgba(0,0,0,0.1)', padding:'15px'}} />
                                  <Area type="monotone" dataKey="rev" stroke="#5956E9" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                               </AreaChart>
                            </ResponsiveContainer>
                         </div>
                      </div>

                      <div className="xl:col-span-4 space-y-6 md:space-y-10">
                         <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl flex flex-col justify-center min-h-[240px]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:bg-primary/40 transition-all duration-1000" />
                            <div className="relative z-10 space-y-6">
                               <div className="space-y-1">
                                  <h3 className="text-lg font-black italic tracking-tight">Active <span className="text-primary">Settlements</span></h3>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending Brokerage Sync</p>
                               </div>
                               <h2 className="text-4xl font-black italic tracking-tighter text-primary">₹{pending.toLocaleString()}</h2>
                               <button className="w-full py-4 bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-slate-900 transition-all">Audit Financial Hub</button>
                            </div>
                         </div>

                         <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Verification Queue</h3>
                                <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[8px] font-black uppercase rounded-lg">Critical</span>
                            </div>
                            <div className="space-y-4">
                               {allUsers.filter(u => u.role === 'company' && !u.isVerified).slice(0, 3).map((c, i) => (
                                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-slate-900">{c.name[0]}</div>
                                       <p className="text-xs font-bold text-slate-700 truncate max-w-[100px]">{c.name}</p>
                                    </div>
                                    <button onClick={() => setTab('companies')} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-primary transition-all"><ChevronRight size={14}/></button>
                                 </div>
                               ))}
                               {allUsers.filter(u => u.role === 'company' && !u.isVerified).length === 0 && (
                                 <div className="py-4 text-center">
                                    <ShieldCheck size={24} className="mx-auto text-emerald-500 mb-2" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">All Nodes Verified</p>
                                 </div>
                               )}
                            </div>
                         </div>

                         <div className="bg-[var(--primary)] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-xl shadow-primary/20">
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">System Integrity</p>
                                    <p className="text-sm font-black italic">Neural Synchronization 100%</p>
                                </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {tab === "settlements" && (
                <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} className="space-y-10">
                   <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                      <div className="space-y-1">
                         <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">Financial <span className="text-primary">Registry</span></h2>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synchronizing corporate liabilities and brokerage payouts.</p>
                      </div>
                      <button onClick={() => { setCreateType("settlement"); setShowCreateModal(true); }} className="px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-primary transition-all flex items-center gap-2 shadow-xl shadow-black/10">
                         <Plus size={14} /> Create Manual Settlement
                      </button>
                   </div>

                   {/* Financial Summary Cards */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-premium">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Paid Revenue</p>
                         <h3 className="text-3xl font-black text-emerald-500 italic">₹{totalRev.toLocaleString()}</h3>
                         <div className="mt-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Settled Nodes</span>
                         </div>
                      </div>
                      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-premium">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Liabilities</p>
                         <h3 className="text-3xl font-black text-amber-500 italic">₹{pending.toLocaleString()}</h3>
                         <div className="mt-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Awaiting Sync</span>
                         </div>
                      </div>
                      <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -mr-12 -mt-12 blur-2xl" />
                         <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Projected Pipeline</p>
                         <h3 className="text-3xl font-black text-primary italic">₹{(totalRev + pending).toLocaleString()}</h3>
                         <div className="mt-4 flex items-center gap-2">
                            <TrendingUp size={12} className="text-primary" />
                            <span className="text-[9px] font-bold text-white/40 uppercase">Global Forecast</span>
                         </div>
                      </div>
                   </div>
 
                   <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="bg-slate-900 text-white">
                               {["Node ID", "Date", "Job Title", "Company", "Candidate", "Value", "State", "Action"].map(h => (
                                 <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">{h}</th>
                               ))}
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            {ledger.map((inv, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                                 <td className="px-8 py-6 text-xs font-bold text-slate-900">#{inv.invoiceId?.slice(-6).toUpperCase() || inv._id?.slice(-6).toUpperCase()}</td>
                                 <td className="px-8 py-6 text-[10px] font-bold text-slate-400">{new Date(inv.createdAt).toLocaleDateString()}</td>
                                 <td className="px-8 py-6 text-xs font-bold text-slate-900 truncate max-w-[150px]">{inv.jobId?.title || "Manual Entry"}</td>
                                 <td className="px-8 py-6 text-xs font-bold text-slate-600">{inv.companyId?.name}</td>
                                 <td className="px-8 py-6 text-xs font-bold text-slate-600">{inv.candidateId?.name}</td>
                                 <td className="px-8 py-6 text-sm font-black text-slate-900 italic">₹{inv.amount?.toLocaleString()}</td>
                                 <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                       {inv.status}
                                    </span>
                                 </td>
                                 <td className="px-8 py-6">
                                    {inv.status !== 'Paid' ? (
                                       <button onClick={() => handleSettle(inv._id)} className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg hover:bg-primary transition-all">Settle</button>
                                    ) : (
                                       <button className="p-2 bg-emerald-50 rounded-lg text-emerald-500 cursor-default"><ShieldCheck size={16}/></button>
                                    )}
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </motion.div>
              )}

              {tab === "manage_jobs" && (
                 <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8">
                    <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-black text-slate-900 italic">Job <span className="text-primary">Moderation</span></h3>
                       <div className="flex gap-4">
                          <div className="relative">
                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                             <input 
                                type="text" 
                                placeholder="Search by title, company..." 
                                value={searchJobs}
                                onChange={(e) => setSearchJobs(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all w-64" 
                             />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center">{allJobs.length} System Nodes</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       {allJobs.filter(j => 
                          j.title?.toLowerCase().includes(searchJobs.toLowerCase()) || 
                          j.company?.toLowerCase().includes(searchJobs.toLowerCase())
                       ).map((job, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-lg transition-all group">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                 <Briefcase size={20} />
                              </div>
                              <div>
                                 <h4 className="text-sm font-black text-slate-900">{job.title}</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.company}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="text-right">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                 <p className={`text-[10px] font-black uppercase ${job.approvalStatus === 'Approved' ? 'text-emerald-500' : 'text-amber-500'}`}>{job.approvalStatus || 'Pending'}</p>
                              </div>
                              <div className="flex gap-2">
                                 {job.approvalStatus !== 'Approved' && (
                                    <button onClick={() => handleApproveJob(job._id)} className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg hover:bg-emerald-500 transition-all">Approve</button>
                                 )}
                                 <button onClick={() => handleRejectJob(job._id)} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><XCircle size={16}/></button>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}
              
              {tab === "candidates" && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8">
                   <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-slate-900 italic">Talent <span className="text-primary">Pool</span></h3>
                      <div className="flex gap-4">
                         <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search by name, email..." 
                                value={searchUsers}
                                onChange={(e) => setSearchUsers(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all w-64" 
                             />
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allUsers.filter(u => 
                          u.role !== 'admin' && 
                          (u.name?.toLowerCase().includes(searchUsers.toLowerCase()) || 
                           u.email?.toLowerCase().includes(searchUsers.toLowerCase()))
                       ).map((user, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium relative overflow-hidden group">
                           <div className="flex items-center gap-5 mb-6">
                              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shadow-inner uppercase">{user.name[0]}</div>
                              <div className="min-w-0">
                                 <h4 className="text-lg font-black text-slate-900 truncate">{user.name}</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                 <span>Role Node</span>
                                 <span className="text-primary">{user.role}</span>
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => handleBan(user._id)} className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-primary transition-all">{user.banned ? 'Unban' : 'Ban'}</button>
                                 <button onClick={() => handleDeleteUser(user._id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Ban size={18}/></button>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}
                      {tab === "companies" && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8">
                   <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-slate-900 italic">Enterprise <span className="text-primary">Partners</span></h3>
                      <div className="flex gap-4">
                         <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                               type="text" 
                               placeholder="Search companies..." 
                               value={searchCompanies}
                               onChange={(e) => setSearchCompanies(e.target.value)}
                               className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all w-64" 
                            />
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allUsers.filter(u => 
                          u.role === 'company' && 
                          (u.name?.toLowerCase().includes(searchCompanies.toLowerCase()) || 
                           u.email?.toLowerCase().includes(searchCompanies.toLowerCase()))
                       ).map((company, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium relative overflow-hidden group">
                           <div className="flex items-center gap-5 mb-6">
                              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shadow-inner uppercase">{company.name[0]}</div>
                              <div className="min-w-0">
                                 <h4 className="text-lg font-black text-slate-900 truncate">{company.name}</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{company.email}</p>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                 <span>Status</span>
                                 <span className={company.isVerified ? "text-emerald-500" : "text-amber-500"}>{company.isVerified ? 'Verified' : 'Pending'}</span>
                              </div>
                              <div className="flex gap-2">
                                 {!company.isVerified && <button onClick={() => handleApproveCompany(company._id)} className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-emerald-500 transition-all">Approve</button>}
                                 {company.isVerified && <button className="flex-1 py-3 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-xl cursor-default">Approved</button>}
                                 <button onClick={() => handleDeleteCompany(company._id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Ban size={18}/></button>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {tab === "settings" && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-4xl mx-auto py-10 w-full">
                   <div className="bg-white rounded-[4rem] p-16 border border-slate-100 shadow-premium space-y-12">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">System <span className="text-primary">Configuration</span></h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform Name</label>
                               <input type="text" defaultValue="JobGrox Core" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Global Brokerage Fee (%)</label>
                               <input type="number" defaultValue="8" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all" />
                            </div>
                         </div>
                         <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem]">
                               <div>
                                  <p className="text-xs font-black text-slate-900">Maintenance Mode</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Offline all client nodes</p>
                               </div>
                               <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" /></div>
                            </div>
                         </div>
                      </div>
                      <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/10">Synchronize Nodes</button>
                   </div>
                </motion.div>
              )}

              {tab === "alerts" && (
                 <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">System <span className="text-primary">Alerts</span></h2>
                    <div className="space-y-4">
                       {notifications.length > 0 ? notifications.slice(0, 10).map((a, i) => (
                         <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-primary/20 transition-all">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${a.type === 'Warning' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-primary'}`}>
                               <Bell size={20} />
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-slate-900">{a.message}</h4>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(a.createdAt).toLocaleString()} | {a.senderName}</p>
                            </div>
                         </div>
                       )) : (
                         <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100">
                            <Zap size={40} className="mx-auto text-slate-100 mb-4" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No critical system events detected.</p>
                         </div>
                       )}
                    </div>
                 </motion.div>
               )}

               {tab === "resources" && (
                 <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-10">
                    <div className="flex items-center justify-between">
                       <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Market <span className="text-primary">Intelligence</span></h2>
                       <button className="px-6 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all flex items-center gap-2">
                          <Download size={14} /> Export Node Map
                       </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-premium">
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10">Node Distribution</h4>
                          <div className="h-[300px]">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                   <Pie
                                      data={[
                                         { name: 'Companies', value: stats.companies || 0 },
                                         { name: 'Candidates', value: stats.candidates || 0 },
                                         { name: 'Jobs', value: stats.jobs || 0 }
                                      ]}
                                      innerRadius={60}
                                      outerRadius={100}
                                      paddingAngle={8}
                                      dataKey="value"
                                   >
                                      <Cell fill="#5956E9" />
                                      <Cell fill="#8B5CF6" />
                                      <Cell fill="#C7D2FE" />
                                   </Pie>
                                   <Tooltip />
                                </PieChart>
                             </ResponsiveContainer>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                             <h4 className="text-xs font-black uppercase tracking-widest opacity-60 mb-6">Growth Intelligence</h4>
                             <div className="space-y-6">
                                <div>
                                   <div className="flex justify-between mb-2">
                                      <span className="text-[10px] font-bold uppercase">Candidate Saturation</span>
                                      <span className="text-[10px] font-bold">84%</span>
                                   </div>
                                   <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                      <div className="w-[84%] h-full bg-primary" />
                                   </div>
                                </div>
                                <div>
                                   <div className="flex justify-between mb-2">
                                      <span className="text-[10px] font-bold uppercase">Market Liquidity</span>
                                      <span className="text-[10px] font-bold">62%</span>
                                   </div>
                                   <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                      <div className="w-[62%] h-full bg-emerald-500" />
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
                             <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Strategic Forecast</h4>
                             <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"System nodes indicating high potential for enterprise expansion in the Q3 fiscal vector. Recommend prioritizing manual node verification for verified MNC partners."</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}} className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden">
               <div className="p-10 space-y-8">
                              <div className="flex items-center justify-between">
                     <h3 className="text-2xl font-black italic tracking-tighter">Initialize <span className="text-primary">{createType === 'settlement' ? 'Settlement' : 'Node'}</span></h3>
                     <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-all"><XCircle size={24} className="text-slate-400" /></button>
                  </div>

                  <form className="space-y-6" onSubmit={handleCreateSettlement}>
                      {createType === 'settlement' ? (
                        <>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-400">Enterprise Node</label>
                                 <select name="companyId" className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20">
                                    {allUsers.filter(u => u.role === 'company').map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-400">Talent Node</label>
                                 <select name="candidateId" className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="">N/A (General Fee)</option>
                                    {allUsers.filter(u => u.role === 'candidate').map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                 </select>
                              </div>
                           </div>
                           <div className="grid grid-cols-3 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-400">Value (₹)</label>
                                 <input name="amount" type="number" required className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20" placeholder="50000" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-400">Fee Logic</label>
                                 <select name="feeType" className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="fixed">Fixed Rate</option>
                                    <option value="percentage">Percentage</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-400">Base Value</label>
                                 <input name="feeValue" type="number" className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20" placeholder="8" />
                              </div>
                           </div>
                        </>
                      ) : (
                       <div className="space-y-4">
                          <p className="text-sm font-medium text-slate-500">System is ready for manual node injection. Deploying {createType}...</p>
                       </div>
                     )}
                     <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/10">Synchronize Protocol</button>
                  </form>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
