import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ icon, label, value, trend, trendType = 'up' }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">{label}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight italic">{value}</p>
          {trend && (
            <div className="flex items-center gap-2 pt-2">
               <div className={`p-1 rounded-full ${trendType === 'up' ? 'bg-[var(--primary-light)] text-[var(--primary)]' : 'bg-red-50 text-red-500'}`}>
                  {trendType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
               </div>
               <span className={`text-[11px] font-bold ${trendType === 'up' ? 'text-[var(--primary)]' : 'text-red-500'}`}>{trend}</span>
               <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Growth Matrix</span>
            </div>
          )}
        </div>
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-[var(--primary-light)] group-hover:border-[var(--primary)]/30 transition-all duration-500 text-slate-400 group-hover:text-[var(--primary)]">
          <div className="group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}


