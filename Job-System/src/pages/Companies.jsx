import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Building2, Globe, ShieldCheck, Search, Filter, Loader2, Lock, Star } from "lucide-react";
import useDebounce from '../hooks/useDebounce';
import SafeImage from '../components/SafeImage';
import { useAppContext } from '../context/AppContext';

export default function Companies() {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useAppContext();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {}
    }
  }, []);

  const isMNC = (companyName) => {
    const bigCompanies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Tesla', 'Apple', 'Netflix'];
    return bigCompanies.includes(companyName);
  };

  const isLocked = (company) => {
    if (!user) return false;
    // Lock MNCs for Free users
    const userPlan = user.premiumPlan || 'free';
    return isMNC(company.companyName) && userPlan === 'free';
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const url = debouncedSearch 
        ? `/api/companies/search?q=${debouncedSearch}` 
        : '/api/companies';
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
           setCompanies(data);
        } else {
           await loadSimulatedCompanies();
        }
      } else {
        await loadSimulatedCompanies();
      }
    } catch (err) {
      console.error('Network sync failure, routing to local matrix:', err);
      await loadSimulatedCompanies();
    } finally {
      setLoading(false);
    }
  };

  const loadSimulatedCompanies = async () => {
    const { apiMock } = await import('../services/apiMock');
    const mockData = await apiMock.getCompanies({ search: debouncedSearch });
    setCompanies(mockData);
  };

  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearch]);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50 pb-20 pt-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight italic">Corporate <span className="text-[var(--primary)]">Network</span></h1>
              <div className="flex items-center gap-3">
                 <ShieldCheck size={16} className="text-[var(--primary)]" />
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Exploring Registered Enterprise Nodes | Synchronized</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex items-center px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-[var(--primary)] transition-all">
                  <Search size={16} className="text-slate-300 mr-2" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search entities..." 
                    className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600 outline-none w-48" 
                  />
               </div>
               <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[var(--primary)] transition-all">
                  <Filter size={18} />
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
               [...Array(8)].map((_, i) => (
                  <div key={i} className="h-[320px] bg-white p-10 rounded-[2.5rem] border border-slate-100 animate-pulse flex flex-col justify-between">
                     <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl"></div>
                        <div className="space-y-2">
                           <div className="h-4 w-24 bg-slate-100 rounded-full"></div>
                           <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="h-3 w-full bg-slate-50 rounded-full"></div>
                        <div className="h-3 w-3/4 bg-slate-50 rounded-full"></div>
                     </div>
                     <div className="h-10 w-full bg-slate-50 rounded-xl mt-6"></div>
                  </div>
               ))
            ) : companies.length > 0 ? (
              companies.map((company, idx) => (
                <div
                  key={company._id}
                  onClick={() => !isLocked(company) && navigate(`/company/${company._id}`)}
                  className={`bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all group flex flex-col justify-between h-full relative overflow-hidden ${
                    isLocked(company) ? 'cursor-default' : 'hover:shadow-xl hover:shadow-slate-200/50 cursor-pointer'
                  }`}
                >
                  {isLocked(company) && (
                    <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/40 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 text-[var(--primary)] border border-slate-100">
                        <Lock size={24} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 tracking-tight italic mb-2">Corporate Node Locked</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-4">Direct access to Fortune 500 MNCs requires a Professional clearance.</p>
                      <Link to="/pricing" className="px-6 py-2.5 bg-[var(--primary)] text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-[var(--primary-dark)] transition-all uppercase tracking-widest text-[9px]">
                        Upgrade Access
                      </Link>
                    </div>
                  )}

                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite({ ...company, type: 'company' }); }}
                    className={`absolute top-6 right-6 p-2.5 rounded-xl border transition-all z-10 ${isFavorite(company._id) ? 'bg-amber-50 text-amber-500 border-amber-100 shadow-sm' : 'bg-white/80 backdrop-blur-sm text-slate-300 border-slate-100 hover:text-amber-500 hover:border-amber-100'}`}
                    title={isFavorite(company._id) ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <Star size={16} className={isFavorite(company._id) ? 'fill-current' : ''} />
                  </button>

                  <div className="space-y-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 text-white flex items-center justify-center rounded-2xl font-bold text-2xl shadow-xl transition-transform overflow-hidden ${isLocked(company) ? 'bg-slate-200 shadow-none' : 'bg-[var(--primary)] shadow-primary/20 group-hover:scale-110'}`}>
                        <SafeImage 
                          src={company.logo} 
                          alt={company.companyName} 
                          companyName={company.companyName}
                          className="w-full h-full object-contain"
                          fallbackSize={32}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-[var(--primary)] transition-colors leading-tight">
                          {company.companyName}
                        </h3>
                        <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest mt-1">
                          {company.industry}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                      "{company.description}"
                    </p>
                  </div>
  
                  <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Globe size={14} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           {company.location || 'GLOBAL NODE'}
                        </span>
                     </div>
                     {!isLocked(company) && (
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                          <ArrowRight size={20} />
                       </div>
                     )}
                  </div>
                </div>
              ))
            ) : (
               <div className="col-span-full py-20 text-center bg-white rounded-[3.5rem] border border-slate-100">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                     <Building2 size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 italic">No Enterprise Nodes Located</h3>
                  <p className="text-slate-400 mt-2">Try adjusting your search criteria or node alignment.</p>
               </div>
            )}
          </div>
      </div>
    </Layout>
  );
}

