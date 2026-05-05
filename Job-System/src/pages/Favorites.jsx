import Layout from '../components/Layout';
import { useAppContext } from '../context/AppContext';
import { Star, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { favorites, toggleFavorite } = useAppContext();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Favorites</h1>
          <p className="text-lg text-slate-500 font-medium">Your curated list of top companies and verified resources.</p>
        </header>

        {favorites.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 border border-slate-100 rounded-3xl">
            <Star size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No Favorites Yet</h3>
            <p className="text-slate-500 mt-2">Star companies and resources to add them here.</p>
            <Link to="/companies" className="inline-block mt-6 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-colors">
              Browse Companies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group relative">
                 <button 
                   onClick={() => toggleFavorite(item)}
                   className="absolute top-4 right-4 p-2 bg-yellow-50 text-yellow-500 rounded-xl hover:bg-yellow-100 transition-colors"
                   title="Remove from Favorites"
                 >
                   <Star size={16} className="fill-current" />
                 </button>
                 
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 mb-6">
                    {item.type === 'company' ? <Building2 className="text-primary" /> : <ExternalLink className="text-primary" />}
                 </div>

                 <div className="space-y-2 mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type || 'Entity'}</span>
                    <h3 className="text-xl font-bold text-slate-900">{item.name || 'Unknown'}</h3>
                    <p className="text-sm font-semibold text-slate-500 line-clamp-2">{item.description || 'No description available for this verified entity.'}</p>
                 </div>

                 {item.type === 'company' ? (
                   <Link to={`/company/${item.id}`} className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 border border-slate-200">
                      View Details
                   </Link>
                 ) : (
                   <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 border border-slate-200">
                      Access Resource <ExternalLink size={14} />
                   </a>
                 )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
