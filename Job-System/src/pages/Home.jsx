import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Users, Briefcase, MapPin, Globe, ShieldCheck, History, Building2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const { recentViews } = useAppContext();
  const [stats, setStats] = useState({ jobs: 0, companies: 0, users: 0 });

  useEffect(() => {
    const targetStats = { jobs: 1205450, companies: 8400, users: 620000 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setStats({
        jobs: Math.round(targetStats.jobs * progress),
        companies: Math.round(targetStats.companies * progress),
        users: Math.round(targetStats.users * progress)
      });
      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targetStats);
      }
    }, increment);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: 'Verified Opportunities',
      description: 'Every job listing is manually vetted by our corporate integrity team to ensure quality.'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI Precision Matching',
      description: 'Our proprietary algorithms match your unique skill profile with the most relevant roles.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Network',
      description: 'Access exclusive roles from Fortune 500 companies and high-growth global startups.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Elite Talent Pool',
      description: 'Join a community of top-tier professionals and accelerate your career trajectory.'
    }
  ];

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-48 lg:pb-56 overflow-hidden bg-canva-cloud border-b border-slate-100">
          <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              
              {/* Left Column */}
              <div className="lg:w-1/2 space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                  <Sparkles size={16} className="text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">The Gold Standard in Recruitment</span>
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-navy leading-[1.1] tracking-tighter italic">
                  The Global <br className="hidden sm:block" />
                  <span className="text-primary">Job Network.</span>
                </h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                   JobGrox intelligently connects talent and top-tier companies across IT, Healthcare, Engineering, Banking, and Local operations worldwide.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-6">
                  <Link to="/register" className="px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-dark active:scale-95 transition-all duration-300 text-center uppercase tracking-widest text-xs">
                    Initialize Account
                  </Link>
                  <Link to="/jobs" className="px-10 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 active:scale-95 transition-all duration-300 text-center uppercase tracking-widest text-xs">
                    Explore Network
                  </Link>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-10 pt-20 grayscale opacity-40">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="h-6" />
                </div>
              </div>

              {/* Right Column (Visual) */}
              <div className="lg:w-1/2 w-full max-w-lg mx-auto relative animate-in fade-in zoom-in-95 duration-1000 delay-200 mt-16 lg:mt-0 xl:pl-10">
                <div className="bg-white p-4 sm:p-6 rounded-[3rem] sm:rounded-[4rem] shadow-2xl border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                   <div className="bg-navy rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 md:p-16 space-y-8 sm:space-y-12 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-48 sm:w-64 h-48 sm:h-64 bg-primary/10 rounded-full blur-3xl"></div>
                      <div className="flex justify-between items-center text-left">
                         <div>
                            <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1">Active Synchronizations</p>
                            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tighter italic">{stats.users.toLocaleString()}</h3>
                         </div>
                         <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10">
                            <Users size={32} />
                         </div>
                      </div>
                      <div className="space-y-4">
                         {['Global IT Deployment', 'Healthcare & Medical', 'Core Engineering', 'Banking & Finance', 'Local Operations'].map((t, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-150 transition-transform"></div>
                               <p className="text-white/60 font-medium text-sm">{t}</p>
                            </div>
                         ))}
                      </div>
                      <Link to="/jobs" className="w-full py-4 bg-white text-navy font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-primary-light active:scale-95 outline-none transition-all duration-300 uppercase tracking-widest text-xs">
                         View All Nodes <ArrowRight size={18} />
                      </Link>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Bar Section */}
        <section className="-mt-16 md:-mt-14 relative z-30 px-4 sm:px-6 lg:px-8 mb-24 md:mb-32">
          <div className="bg-white p-3 md:p-3 rounded-3xl md:rounded-full shadow-2xl md:shadow-xl shadow-slate-200/50 border border-slate-100 max-w-5xl mx-auto flex flex-col md:flex-row gap-3 md:gap-2">
            <div className="flex-1 flex items-center px-5 py-4 bg-slate-50 md:bg-transparent group focus-within:bg-primary/5 rounded-2xl md:rounded-full transition-all">
              <Search className="text-slate-400 group-focus-within:text-primary shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Job title, department, or company..." 
                className="w-full bg-transparent border-none focus:ring-0 px-4 font-bold text-navy placeholder-slate-400 truncate"
              />
            </div>
            <div className="w-px bg-slate-100 hidden md:block my-2 shrink-0"></div>
            <div className="md:w-64 flex items-center px-5 py-4 bg-slate-50 md:bg-transparent group focus-within:bg-primary/5 rounded-2xl md:rounded-full transition-all shrink-0">
              <MapPin className="text-slate-400 group-focus-within:text-primary shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Location (Remote)" 
                className="w-full bg-transparent border-none focus:ring-0 px-4 font-bold text-navy placeholder-slate-400 truncate"
              />
            </div>
            <Link to="/jobs" className="bg-primary text-white px-10 py-4 rounded-2xl md:rounded-full font-black hover:bg-primary-dark flex items-center justify-center gap-2 active:scale-95 transition-all duration-300 shadow-xl shadow-primary/20 w-full md:w-auto uppercase tracking-widest text-xs">
              Find Jobs <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Dynamic Recent Activity - Added for Synchronization Visual */}
        {recentViews.length > 0 && (
          <section className="pb-32 px-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-navy italic">Recent Activity</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trace back your application journey.</p>
                </div>
                <Link to="/recent" className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest hover:gap-3 transition-all">
                  View Full History <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentViews.slice(0, 3).map((item, idx) => (
                  <Link 
                    key={item.id || idx} 
                    to={item.type === 'company' ? `/company/${item.id}` : `/job/${item.id}`}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {item.type === 'company' ? <Building2 size={24}/> : <Briefcase size={24}/>}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.type || 'Activity'}</p>
                        <h3 className="font-bold text-navy truncate max-w-[150px]">{item.title || item.companyName || 'Entity'}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><MapPin size={12}/> {item.location || 'Remote'}</span>
                      <span className="flex items-center gap-1.5"><History size={12}/> {item.viewedAt ? new Date(item.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Matrix */}
        <section className="py-24 md:py-40 bg-white relative px-4 sm:px-6 lg:px-8">
          <div className="container-custom mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-4">
               <h2 className="text-4xl md:text-5xl font-bold text-navy tracking-tight italic">Protocol <span className="text-primary">Advantage</span></h2>
               <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em]">Engineered for quality, accessibility, and speed.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {features.map((f, i) => (
                <div key={i} className="bg-white p-10 rounded-[1.5rem] border border-slate-100 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                    <div className="text-primary group-hover:text-white">{f.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-4">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 md:py-40 bg-white px-4 sm:px-6 lg:px-8">
          <div className="container-custom mx-auto text-center">
             <div className="bg-navy rounded-[3rem] sm:rounded-[4rem] md:rounded-[5rem] p-12 sm:p-20 md:p-32 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-primary/5 rounded-full blur-[100px] md:blur-[120px] group-hover:bg-primary/10 transition-all duration-700"></div>
                <div className="relative z-10 space-y-8 md:space-y-12">
                   <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter italic leading-none">Ready to Define <br className="hidden sm:block" /> Your Career?</h2>
                   <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-medium italic">Join {stats.users.toLocaleString()}+ elite professionals pushing the boundaries of technology and innovation.</p>
                   <div className="flex justify-center flex-wrap gap-6 pt-4">
                      <Link to="/register" className="px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                        Join the Network <ArrowRight size={20} />
                      </Link>
                      <Link to="/login" className="px-10 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 active:scale-95 transition-all duration-300 flex items-center gap-3 uppercase tracking-widest text-xs border border-white/10">
                        Access Terminal
                      </Link>
                   </div>
                </div>
             </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
