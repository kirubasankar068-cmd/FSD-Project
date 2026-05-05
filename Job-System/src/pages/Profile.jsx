import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User, Mail, MapPin, Briefcase, Star, Clock, FileText, Settings, ShieldCheck, Zap, BarChart3, TrendingUp, History, Globe } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Profile() {
  const { user: authUser, recentViews, favorites, savedJobs } = useAppContext();
  const [profileData, setProfileData] = useState(authUser || {});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Sync with local storage user if context is empty
    if (!authUser) {
      try {
        const stored = localStorage.getItem('user');
        if (stored) setProfileData(JSON.parse(stored));
      } catch (e) {
        console.error("Profile sync failure:", e);
      }
    } else {
      setProfileData(authUser);
    }
  }, [authUser]);

  const stats = [
    { label: 'Sync Nodes', value: savedJobs?.length || 0, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Favorites', value: favorites?.length || 0, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'History', value: recentViews?.length || 0, icon: History, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Experience', value: `${profileData.experience || 0}Y`, icon: Clock, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        
        {/* Profile Hero Header */}
        <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-sm group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50/30 rounded-full -ml-20 -mb-20 blur-2xl" />
           
           <div className="relative flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-indigo-200 group-hover:rotate-3 transition-transform">
                  {profileData.name?.[0] || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white border-4 border-slate-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg">
                  <ShieldCheck size={24} />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4 min-w-0">
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-header">{profileData.name || 'Anonymous User'}</h1>
                    {profileData.isPremium && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200">Premium Pro</span>
                    )}
                  </div>
                  <p className="text-xl text-slate-400 font-bold uppercase tracking-widest text-xs">{profileData.role || 'Member'} Node — Identity Verified</p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-sm font-semibold">
                    <Mail size={16} className="text-indigo-600" /> {profileData.email}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-sm font-semibold">
                    <MapPin size={16} className="text-indigo-600" /> {profileData.location || 'Distributed Node'}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-sm font-semibold">
                    <Briefcase size={16} className="text-indigo-600" /> {profileData.experience || 0} Years Exp.
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                 <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                    Update Registry
                 </button>
                 <button className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                    Identity Settings
                 </button>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {stats.map((stat, i) => {
             const Icon = stat.icon;
             return (
               <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                    <Icon size={24} />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{stat.label}</p>
               </div>
             )
           })}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Sidebar Info */}
           <div className="space-y-8">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-indigo-600" /> Skill Matrix
                </h3>
                <div className="flex flex-wrap gap-2">
                   {(profileData.skills || []).map((skill, idx) => (
                     <span key={idx} className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl border border-indigo-100">
                        {skill}
                     </span>
                   ))}
                   {(!profileData.skills || profileData.skills.length === 0) && (
                     <p className="text-slate-400 text-sm italic py-4">No skill nodes established.</p>
                   )}
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-6">
                   <Zap size={40} className="text-amber-200 rotate-12 group-hover:rotate-0 transition-transform" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Resource Protocol</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Plan Status</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-slate-600">Current Node:</span>
                     <span className="text-xs font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-lg">{(profileData.premiumPlan || 'Free Tier').toUpperCase()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-600 w-1/3" />
                  </div>
                  <button className="w-full py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black transition-colors">
                     Optimize Logic
                  </button>
                </div>
              </div>
           </div>

           {/* Main Center Content */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm min-h-[400px]">
                 <div className="flex items-center gap-8 border-b border-slate-50 mb-8">
                   {['overview', 'resume', 'activity'].map(tab => (
                     <button
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                       {tab}
                       {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />}
                     </button>
                   ))}
                 </div>

                 {activeTab === 'overview' && (
                   <div className="space-y-8 animate-in fade-in duration-500">
                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-slate-900">Career Summary</h4>
                        <p className="text-slate-500 leading-relaxed font-medium">
                           Professional manifest for {profileData.name}. Identity currently active in the {profileData.location || 'distributed'} sector with a focus on {profileData.role || 'Member'} operations.
                           No deep biography established in core node.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                           <div className="flex items-center gap-3 text-slate-900 font-bold">
                              <ShieldCheck size={18} className="text-emerald-500" />
                              Privacy protocol
                           </div>
                           <p className="text-xs text-slate-500 font-medium">Your data is currently encrypted and visible only to established premium nodes.</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                           <div className="flex items-center gap-3 text-slate-900 font-bold">
                              <Globe size={18} className="text-indigo-500" />
                              Global Reach
                           </div>
                           <p className="text-xs text-slate-500 font-medium">Your profile node is accessible across 12+ international industrial hubs.</p>
                        </div>
                      </div>
                   </div>
                 )}

                 {activeTab === 'resume' && (
                   <div className="space-y-8 animate-in fade-in duration-500">
                      <div className="flex items-center justify-between">
                         <h4 className="text-xl font-bold text-slate-900">Resume Protocol</h4>
                         <button className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-100 transition-all">
                            Refresh Node
                         </button>
                      </div>
                      
                      {profileData.resume ? (
                        <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4">
                           <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                              <FileText size={32} />
                           </div>
                           <div className="space-y-1">
                              <p className="text-lg font-bold text-slate-900">Active Resume Detected</p>
                              <p className="text-sm font-medium text-slate-400">Successfully parsed and indexed in neural vault.</p>
                           </div>
                           <button className="px-6 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all">
                              View Raw Data
                           </button>
                        </div>
                      ) : (
                        <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4">
                           <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center">
                              <FileText size={32} />
                           </div>
                           <div className="space-y-1">
                              <p className="text-lg font-bold text-slate-900">Zero Resume Transmission</p>
                              <p className="text-sm font-medium text-slate-400">Establish your career profile by uploading your resume.</p>
                           </div>
                           <button className="px-8 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all">
                              Upload Node
                           </button>
                        </div>
                      )}
                   </div>
                 )}
                 
                 {activeTab === 'activity' && (
                   <div className="flex items-center justify-center h-64 text-slate-300">
                      <p className="font-bold text-xs uppercase tracking-[0.2em]">Synchronizing interaction history...</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
}
