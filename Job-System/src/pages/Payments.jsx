import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  Wallet, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  FileText, 
  Download, 
  Filter, 
  Search,
  CreditCard,
  History,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { apiMock } from '../services/apiMock';

export default function Payments() {
  const navigate = useNavigate();
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLedger = async () => {
      setLoading(true);
      const data = await apiMock.getFinancialLedger();
      setLedger(data);
      setLoading(false);
    };
    fetchLedger();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Paid': return <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5 w-fit"><CheckCircle2 size={10} /> Paid Signal</span>;
      case 'Pending': return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-1.5 w-fit"><Clock size={10} /> Pending Hub</span>;
      default: return <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100">{status}</span>;
    }
  };

  const stats = [
    { label: 'Total Volume', value: '₹4.2L', icon: <TrendingUp size={18} />, color: 'text-emerald-500' },
    { label: 'Carrier Fees', value: '₹32.5K', icon: <CreditCard size={18} />, color: 'text-[var(--primary)]' },
    { label: 'Active Links', value: '12', icon: <History size={18} />, color: 'text-indigo-500' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50 pb-20 pt-16">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Financial <span className="text-[var(--primary)]">Ledger</span></h1>
              <div className="flex items-center gap-3">
                 <ShieldCheck size={16} className="text-[var(--primary)]" />
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Subscription & Transaction Audit Matrix | Synchronized</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/pricing')}
              className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-[9px]"
            >
               Upgrade Carrier Plan <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
             {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                     <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">{stat.value}</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                     {stat.icon}
                  </div>
                </div>
             ))}
          </div>

          {/* Main Ledger Area */}
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
             
             {/* Dynamic Filter Bar */}
             <div className="px-10 py-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/10">
                <div className="relative w-full md:w-96">
                   <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                   <input 
                    type="text" 
                    placeholder="Filter transaction hex..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                   />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                   <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:text-[var(--primary)] transition-all">
                      <Filter size={14} /> Nodes
                   </button>
                   <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary-light)] text-[var(--primary)] rounded-xl text-xs font-black uppercase tracking-widest">
                      <Download size={14} /> Export Audit
                   </button>
                </div>
             </div>

             {/* Ledger Table */}
             <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50/20">
                         <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Code</th>
                         <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity / Origin</th>
                         <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transmission Date</th>
                         <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payload Amount</th>
                         <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Protocol Status</th>
                         <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {loading ? (
                         [...Array(4)].map((_, i) => (
                            <tr key={i}>
                               <td colSpan="6" className="px-10 py-6 animate-pulse">
                                  <div className="h-6 bg-slate-50 rounded-lg w-full"></div>
                               </td>
                            </tr>
                         ))
                      ) : ledger.length > 0 ? (
                         ledger.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50/40 transition-colors group">
                               <td className="px-10 py-8">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                        <FileText size={16} />
                                     </div>
                                     <span className="text-xs font-black text-slate-900 tracking-tight">{item.invoiceId}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-8">
                                  <div className="space-y-0.5">
                                     <p className="text-xs font-bold text-slate-700 leading-none">{item.companyId?.name || "Corporate Node"}</p>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">{item.jobId?.title || "Specialized Node"}</p>
                                  </div>
                               </td>
                               <td className="px-6 py-8 text-xs font-bold text-slate-500">
                                  {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                               </td>
                               <td className="px-6 py-8">
                                  <span className="text-sm font-black text-slate-900 tracking-tighter italic">₹{item.amount.toLocaleString()}</span>
                               </td>
                               <td className="px-6 py-8">
                                  <div className="flex justify-center flex-col items-center">
                                     {getStatusBadge(item.status)}
                                  </div>
                               </td>
                               <td className="px-10 py-8 text-right">
                                  <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-[var(--primary)] hover:border-[var(--primary-light)] transition-all shadow-sm">
                                     <Download size={16} />
                                  </button>
                               </td>
                            </tr>
                         ))
                      ) : (
                         <tr>
                            <td colSpan="6" className="px-10 py-24 text-center">
                               <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                                  <Wallet size={36} />
                               </div>
                               <h4 className="text-xl font-bold text-slate-900 italic">No sequences detected</h4>
                               <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto mt-2">Your financial ledger will materialize once carrier transactions are initialized.</p>
                            </td>
                         </tr>
                      )}
                   </tbody>
                </table>
             </div>

             {/* Footer Disclosure */}
             <div className="px-10 py-8 bg-slate-50/30 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <ShieldCheck size={12} className="text-emerald-500" /> Encrypted Transaction Security Protocol Active
                </p>
                <div className="flex items-center gap-6">
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest cursor-pointer hover:text-slate-900">Audit Guidelines</span>
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest cursor-pointer hover:text-slate-900">Carrier Policies</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
