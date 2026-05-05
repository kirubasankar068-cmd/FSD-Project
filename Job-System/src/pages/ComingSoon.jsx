import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Construction } from 'lucide-react';
import Layout from '../components/Layout';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-24 h-24 bg-[var(--primary)]/10 rounded-[2rem] flex items-center justify-center mb-10 border border-[var(--primary)]/20 shadow-xl shadow-[var(--primary)]/5">
          <Construction className="text-[var(--primary)]" size={40} />
        </div>
        
        <div className="space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-4">
            <Sparkles size={14} className="text-[var(--primary)]" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol in Development</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--secondary)] tracking-tight">
            Optimizing this <br />
            <span className="text-[var(--primary)]">Node.</span>
          </h1>
          
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            This module is currently undergoing AI-driven enhancement. We're engineering a premium experience for elite professionals like you.
          </p>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="mt-12 flex items-center gap-3 px-8 py-4 bg-[var(--secondary)] text-white font-bold rounded-2xl hover:bg-[#1a2e44] transition-all shadow-lg shadow-[var(--secondary)]/20 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Retrace Steps
        </button>

        <div className="mt-20 pt-10 border-t border-slate-100 w-full max-w-2xl flex justify-center gap-10 grayscale opacity-40">
           <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-slate-300">ENG</span>
              <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Status</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-slate-300">92%</span>
              <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Ready</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-slate-300">v2.0</span>
              <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Build</span>
           </div>
        </div>
      </div>
    </Layout>
  );
}

