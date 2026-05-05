import Layout from '../components/Layout';
import { useAppContext } from '../context/AppContext';
import { History, Eye, MapPin, Briefcase, Building2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentlyViewed() {
  const { recentViews } = useAppContext();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Recently Viewed</h1>
          <p className="text-lg text-slate-500 font-medium">Trace back your application journey.</p>
        </header>

        {recentViews.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 border border-slate-100 rounded-3xl">
            <History size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No History</h3>
            <p className="text-slate-500 mt-2">Start exploring jobs to build your history.</p>
            <Link to="/jobs" className="inline-block mt-6 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-colors">
              Explore Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {recentViews.map((item, idx) => {
              // Defensive extraction to prevent "Objects are not valid as a React child"
              const getSubtitle = () => {
                const sub = item.company || item.industry || 'External Node';
                if (typeof sub === 'object' && sub !== null) {
                  return sub.companyName || sub.name || 'Corporate Node';
                }
                return String(sub);
              };

              const info = {
                title: item.title || item.companyName || item.name || 'Unknown Entity',
                subtitle: getSubtitle(),
                location: item.location || 'Distributed',
                type: item.type || (item.companyName ? 'company' : 'job'),
                link: item.type === 'company' ? `/company/${item.id}` : `/job/${item.id}`
              };

              return (
              <div key={item.id || idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  {info.type === 'company' ? <Building2 size={16} /> : <Eye size={16} />}
                </div>
                {/* Card */}
                <Link to={info.link} className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all decoration-transparent">
                  <div className="flex items-start justify-between">
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${info.type === 'company' ? 'bg-amber-50 text-amber-600' : 'bg-primary/5 text-primary'}`}>
                              {info.type}
                           </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{info.title}</h3>
                        <p className="text-sm font-semibold text-slate-500">{info.subtitle}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs font-bold text-slate-400">
                     <span className="flex items-center gap-1"><MapPin size={14}/> {info.location}</span>
                     <span className="flex items-center gap-1"><History size={14}/> Viewed {item.viewedAt ? new Date(item.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}</span>
                  </div>
                </Link>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
