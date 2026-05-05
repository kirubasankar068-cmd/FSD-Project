import { FileText, Download, Printer, Share2, ShieldCheck, Mail, Building2, MapPin } from 'lucide-react';

export default function InvoiceTemplate({ invoice, company, candidate, job }) {
  if (!invoice) return null;

  return (
    <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 max-w-4xl mx-auto space-y-12 font-sans animate-in fade-in zoom-in-95 duration-500">
      
      {/* Invoice Header */}
      <div className="flex justify-between items-start">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="p-3 bg-slate-900 rounded-2xl">
                  <ShieldCheck className="text-white" size={24} />
               </div>
               <span className="text-3xl font-black text-slate-900 tracking-tighter">Job<span className="text-[var(--primary)]">Grox</span></span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">
               Global AI Node Dispatch<br/>
               Financial Settlement Protocol
            </p>
         </div>
         <div className="text-right space-y-1">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{invoice.status === 'Paid' ? 'Receipt' : 'Invoice'}</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{invoice.invoiceId}</p>
         </div>
      </div>

      <div className="h-px bg-slate-100 w-full"></div>

      {/* Billing Info */}
      <div className="grid grid-cols-2 gap-12">
         <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Building2 size={12}/> Bill To
            </h3>
            <div className="space-y-2">
               <p className="text-2xl font-black text-slate-900 leading-tight">{company?.name || 'Corporate Entity'}</p>
               <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <Mail size={14} className="text-slate-300"/> {company?.email}
               </p>
               <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <MapPin size={14} className="text-slate-300"/> Global Industry Node [Hyd]
               </p>
            </div>
         </div>
         <div className="space-y-6 text-right">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temporal Data</h3>
            <div className="space-y-2">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Issue Date</p>
                  <p className="text-lg font-bold text-slate-900">{new Date(invoice.createdAt).toLocaleDateString()}</p>
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Due Date</p>
                  <p className="text-lg font-bold text-slate-900">{new Date(new Date(invoice.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
               </div>
            </div>
         </div>
      </div>

      {/* Transaction Details */}
      <div className="space-y-6">
         <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hiring Transmission Details</h3>
         <div className="bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-white border-b border-slate-100">
                  <tr>
                     <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Item Description</th>
                     <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Fee Rate</th>
                     <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  <tr>
                     <td className="px-8 py-8">
                        <p className="text-lg font-bold text-slate-900 leading-tight">Placement Brokerage Fee</p>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                           Successful hire of <span className="font-bold text-slate-900">{candidate?.name}</span> for 
                           the role of <span className="font-bold text-slate-900">{job?.title}</span>.
                        </p>
                     </td>
                     <td className="px-8 py-8 text-right align-top">
                        <p className="text-lg font-bold text-slate-900 italic">
                           {invoice.feeType === 'percentage' ? `${invoice.feeValue}% of CTC` : 'Fixed Fee'}
                        </p>
                     </td>
                     <td className="px-8 py-8 text-right align-top">
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{invoice.amount.toLocaleString()}</p>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end pt-6">
         <div className="w-full md:w-80 space-y-4">
            <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase">
               <span>Subtotal</span>
               <span className="text-slate-900 tracking-tighter">₹{invoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase">
               <span>Taxes (GST 0%)</span>
               <span className="text-slate-900 tracking-tighter">₹0.00</span>
            </div>
            <div className="h-px bg-slate-100 w-full"></div>
            <div className="flex justify-between items-center py-4">
               <span className="text-xl font-black text-slate-900 uppercase tracking-widest">Total Settle</span>
               <span className="text-4xl font-black text-[var(--primary)] tracking-tighter">₹{invoice.amount.toLocaleString()}</span>
            </div>
         </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-slate-100">
         <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full flex items-center justify-center ${invoice.status === 'Paid' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
               <ShieldCheck size={20} strokeWidth={3} />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legal Status</p>
               <p className="text-sm font-bold text-slate-900">{invoice.status === 'Paid' ? 'Legally Settled & Verified' : 'Awaiting Settlement Action'}</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
               <Printer size={14} /> Print
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
               <Share2 size={14} /> Share
            </button>
         </div>
      </div>

    </div>
  );
}
