import { useState } from 'react';
import Layout from '../components/Layout';
import { useAppContext } from '../context/AppContext';
import { Bookmark, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SavedJobs() {
  const { savedJobs, toggleSaveJob } = useAppContext();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="space-y-2 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Saved Jobs</h1>
            <p className="text-lg text-slate-500 font-medium">Access your bookmarked opportunities.</p>
          </div>
          <div className="flex items-center gap-4">
             <select 
                className="bg-white border border-slate-200 text-slate-600 text-sm font-bold px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                onChange={(e) => {/* Sort Logic Placeholder */}}
             >
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Title A-Z</option>
             </select>
             <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
               <span className="text-primary font-black">{savedJobs.length} Saved</span>
             </div>
          </div>
        </header>

        {savedJobs.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 border border-slate-100 rounded-3xl">
            <Bookmark size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No Saved Jobs</h3>
            <p className="text-slate-500 mt-2">You haven't bookmarked any opportunities yet.</p>
            <Link to="/jobs" className="inline-block mt-6 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-colors">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {savedJobs.map(job => (
              <div key={job._id || job.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-6 items-start md:items-center group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                   <Briefcase className="text-slate-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{job.title || 'Unknown Title'}</h3>
                    <p className="text-sm font-bold text-slate-500">{job.company || 'Unknown Company'}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary"/> {job.location || 'Remote'}</span>
                    <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-primary"/> {job.salary || 'Competitive'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <button className="flex-1 md:flex-none px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors text-center shadow-lg shadow-primary/20">
                     Apply
                   </button>
                   <button 
                     onClick={() => toggleSaveJob(job)} 
                     className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 border border-transparent transition-all"
                     title="Remove from Saved"
                   >
                     <Bookmark size={20} className="fill-current" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
