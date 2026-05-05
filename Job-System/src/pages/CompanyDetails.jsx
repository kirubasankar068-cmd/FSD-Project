import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Building2, MapPin, Globe, Users, Briefcase, Star, ShieldCheck, Zap, Globe2, ArrowRight } from "lucide-react";
import JobCard from "../components/JobCard";
import JobCardSkeleton from "../components/JobCardSkeleton";
import SafeImage from "../components/SafeImage";
import { useAppContext } from "../context/AppContext";

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRecentView, toggleFavorite, isFavorite } = useAppContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/companies/${id}`);
        if (!res.ok) {
           await loadSimulatedNode();
           return;
        }
        const result = await res.json();
        if (result && result.company) {
            setData(result);
            addRecentView({ ...result.company, type: 'company' }); 
        } else {
            await loadSimulatedNode();
        }
      } catch (err) {
        console.error('Fetch error:', err);
        await loadSimulatedNode();
      } finally {
        setLoading(false);
      }
    };
    
    const loadSimulatedNode = async () => {
        try {
            const { apiMock } = await import('../services/apiMock');
            const mockData = await apiMock.getCompanyById(id);
            if (mockData) {
                setData(mockData);
                addRecentView({ ...(mockData.company || mockData), type: 'company' });
            }
            else setError("ENTITY_NOT_FOUND: Node cannot be recovered from local registry.");
        } catch (e) {
            setError("CRITICAL_FAILURE: Local simulation matrix corrupted.");
        }
    }
    
    fetchCompanyData();
  }, [id]);

  if (loading) return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50 pt-16 pb-20 animate-pulse">
        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 h-64 mb-12"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 h-80"></div>
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 h-96"></div>
          </div>
          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 h-64"></div>
        </div>
      </div>
    </Layout>
  );

  if (error || !data) return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 italic mb-2">Protocol Error Detected</h2>
        <p className="text-slate-500 max-w-sm mb-8">{error || "The requested node protocol is currently offline or corrupted."}</p>
        <button onClick={() => navigate('/companies')} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs">
          Return to Registry
        </button>
      </div>
    </Layout>
  );

  const { company, jobs } = data;

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50 pt-16 pb-20">
          {/* Company Header Card */}
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm mb-12 animate-in fade-in duration-700">
            <div className="flex flex-col xl:flex-row gap-12 items-center text-center xl:text-left">
              <div className="w-32 h-32 bg-[var(--primary)] rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-bold shadow-2xl shadow-primary/20 transition-transform overflow-hidden">
                <SafeImage 
                  src={company.logo} 
                  alt={company.companyName} 
                  companyName={company.companyName}
                  className="w-full h-full object-contain"
                  fallbackSize={64}
                />
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-5xl font-bold text-slate-900 tracking-tight italic">{company.companyName} <span className="text-[var(--primary)]">Decryptor</span></h1>
                  <div className="flex items-center justify-center xl:justify-start gap-3">
                     <ShieldCheck size={16} className="text-[var(--primary)]" />
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{company.industry} | NODE ID: {id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center xl:justify-start gap-8">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={18} className="text-[var(--primary)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{company.location || 'Distributed Global Node'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Globe size={18} className="text-[var(--primary)]" />
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest hover:text-[var(--primary)] transition-colors">{company.website?.replace('https://','')}</a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users size={18} className="text-[var(--primary)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{company.totalEmployees || '500+ Active Nodes'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                   onClick={() => toggleFavorite(company)}
                   className={`px-6 py-5 rounded-2xl border font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${isFavorite(id) ? 'bg-amber-50 text-amber-500 border-amber-100 shadow-amber-200/20 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:text-amber-500 hover:border-amber-100 shadow-sm'}`}
                 >
                   <Star size={18} className={isFavorite(id) ? 'fill-current' : ''} />
                   {isFavorite(id) ? 'In Registry' : 'Save to Favorites'}
                 </button>
                 <button className="px-10 py-5 bg-[var(--primary)] text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-[var(--primary-dark)] transition-all uppercase tracking-widest text-xs flex-1">
                   Establish Direct Link
                 </button>
                 <button 
                   onClick={() => navigate('/candidates')}
                   className="px-10 py-5 bg-slate-100 text-slate-700 hover:text-slate-950 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all uppercase tracking-widest text-xs border border-slate-200 hover:border-slate-300 flex-1"
                 >
                   Explore Global Talent
                 </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* About Section */}
              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                  <div className="p-3 bg-[var(--primary-light)] rounded-xl text-[var(--primary)]">
                    <Building2 size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic">Operational <span className="text-[var(--primary)]">Doctrine</span></h2>
                </div>
                <p className="text-slate-500 text-lg leading-relaxed font-medium italic">
                  "{company.descriptionFull || company.description}"
                </p>
              </div>

              {/* Vacancies Section */}
              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
                    <Briefcase size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic">Active <span className="text-[var(--primary)]">Signals</span></h2>
                </div>
                {jobs && jobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job, index) => (
                      <JobCard key={job._id} job={job} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem]">
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">No active vacancy transmissions detected at this node.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Sidebar */}
            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight italic border-b border-slate-50 pb-6">Node <span className="text-[var(--primary)]">Vitals</span></h3>
                <div className="space-y-4">
                  {[
                    { label: "Trust Index", val: "98.2%", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: "Stability", val: "Optimal", icon: Globe2, color: "text-[var(--primary)]", bg: "bg-[var(--primary-light)]" },
                    { label: "Growth", val: "+15.4%", icon: Zap, color: "text-blue-500", bg: "bg-blue-50" }
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${m.bg} ${m.color} rounded-lg`}><m.icon size={16} /></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</span>
                      </div>
                      <span className="text-lg font-bold text-slate-800 tracking-tighter">{m.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
    </Layout>
  );
}

