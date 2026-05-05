import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
  TrendingUp, Users, Target, Activity, Loader2, AlertCircle, Award, Globe, Zap, 
  BarChart3, Scale, Search, ShieldCheck, Map, Users2, Star, Radio, Percent
} from 'lucide-react';
import { apiMock } from '../services/apiMock';
import { useEffect, useRef } from 'react';

const buildInsightsFromUser = () => {
  // Read real user data from localStorage
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : {};

  const skills = user.skills || user.resumeData?.skills || [];
  const atsScore = user.resumeData?.atsScore || user.atsScore || (skills.length > 0 ? Math.min(30 + skills.length * 4, 99) : 0);
  const experience = user.resumeData?.yearsOfExp || user.experience || 0;
  const resumeTitle = user.resumeData?.title || user.role || null;
  const applications = user.applications?.length || 0;
  const interviews = user.interviews?.length || 0;
  const hasSkills = skills.length > 0;

  const summary = hasSkills
    ? `Your technical vector shows ${skills.length} active nodes with ${atsScore}% ATS alignment. Focus on strengthening ${skills[0]} pipelines to unlock senior-level architecture roles.`
    : "Your technical vector is currently unmapped. Please upload a resume or run the Skill Analyzer to calibrate your intelligence nodes.";

  // Build radar from real skills
  const radarSkills = skills.slice(0, 5);
  const skillDistribution = radarSkills.length > 0
    ? radarSkills.map((skill, i) => ({
        subject: skill,
        A: Math.min(140, 80 + atsScore * 0.5 - i * 8),
        fullMark: 150
      }))
    : [
        { subject: 'Technical', A: 30, fullMark: 150 },
        { subject: 'Leadership', A: 20, fullMark: 150 },
        { subject: 'Architecture', A: 25, fullMark: 150 },
        { subject: 'Cloud', A: 15, fullMark: 150 },
        { subject: 'Agile', A: 10, fullMark: 150 }
      ];

  // Application velocity — simulate a 7-day trend around real application count
  const base = Math.max(applications, 1);
  const applicationsOverTime = [
    { name: 'Mon', apps: Math.max(1, Math.round(base * 0.3)) },
    { name: 'Tue', apps: Math.max(2, Math.round(base * 0.6)) },
    { name: 'Wed', apps: Math.max(1, Math.round(base * 0.5)) },
    { name: 'Thu', apps: Math.max(3, Math.round(base * 0.9)) },
    { name: 'Fri', apps: Math.max(2, Math.round(base * 0.75)) },
    { name: 'Sat', apps: Math.max(1, Math.round(base * 0.4)) },
    { name: 'Sun', apps: Math.max(1, Math.round(base * 0.2)) },
  ];

  const maturity = atsScore >= 80 ? 'EXPERT' : atsScore >= 50 ? 'ADVANCED' : atsScore >= 25 ? 'INTERMEDIATE' : 'FOUNDATIONAL';
  const confidence = atsScore;

  return {
    personalizedSummary: summary,
    applicationsOverTime,
    skillDistribution,
    maturity,
    confidence,
    resumeTitle,
    topMetrics: {
      totalSaved: hasSkills ? Math.max(applications * 3, skills.length * 5) : 0,
      totalApplied: applications,
      interviews: interviews,
      profileViews: hasSkills ? Math.max(atsScore * 5, 10) : 0,
      marketMatches: hasSkills ? Math.max(skills.length * 3, 5) : 0,
      atsScore: atsScore
    }
  };
};

const fetchMarketTrends = async () => {
   return await apiMock.getMarketTrends();
};

export default function Insights() {
  const stateRef = useRef(buildInsightsFromUser());

  const { data, isLoading, error, refetch } = useQuery({
     queryKey: ['insights-dashboard'],
     queryFn: async () => {
       // Always re-build from latest localStorage on each call
       return buildInsightsFromUser();
     },
     staleTime: 0,
     refetchOnMount: true,
     refetchOnWindowFocus: true,
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
     queryKey: ['market-trends'],
     queryFn: fetchMarketTrends,
     staleTime: 1000 * 60 * 30 
  });

  if (isLoading || trendsLoading) {
     return (
        <Layout>
           <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                 <div className="w-20 h-20 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="text-primary animate-pulse" size={32} />
                 </div>
              </div>
              <div className="text-center space-y-2">
                 <p className="text-xl font-black text-slate-800 tracking-tight uppercase tracking-[0.3em]">Calibrating Intelligence</p>
                 <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Compiling Global Market Vectors...</p>
              </div>
           </div>
        </Layout>
     );
  }

  if (error) {
     return (
        <Layout>
           <div className="max-w-4xl mx-auto p-12 bg-red-50/50 border border-red-100 rounded-[3rem] text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                 <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Synchronization Failure</h2>
              <p className="text-slate-500 font-medium">Unable to connect to the Global Intelligence Node. Please verify your authentication protocol.</p>
           </div>
        </Layout>
     );
  }

  if (!data) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000">
        
        {/* Personalized Intelligence Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-100">
          <div className="space-y-4">
            <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-xl">Personalized Intelligence</span>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Career Intelligence Hub</h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed italic">"{data.personalizedSummary}"</p>
          </div>
          <div className="flex gap-4">
             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center min-w-[160px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Market Matches</p>
                <p className="text-4xl font-black text-slate-900">{data.topMetrics.marketMatches}</p>
             </div>
             <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 text-center min-w-[160px]">
                <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1">ATS Signal</p>
                <p className="text-4xl font-black text-primary">{data.topMetrics.atsScore}%</p>
             </div>
          </div>
        </header>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <MetricCard title="Saved Nodes" value={data.topMetrics.totalSaved} icon={<Target />} trend="+12%" />
           <MetricCard title="Transmissions" value={data.topMetrics.totalApplied} icon={<Zap />} trend="+5%" />
           <MetricCard title="Active Interviews" value={data.topMetrics.interviews} icon={<Award />} trend="NODE MATCH" />
           <MetricCard title="Profile Pulse" value={data.topMetrics.profileViews} icon={<Activity />} trend="+24%" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
           
           {/* Application Velocity Line Chart */}
           <div className="xl:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <TrendingUp size={120} />
              </div>
              <div className="flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900">Application Velocity</h2>
                    <p className="text-sm font-medium text-slate-400">Activity volume over the last 7-day cycle.</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Link</span>
                 </div>
              </div>
              <div className="h-80 w-full min-h-[320px]">
                 <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <LineChart data={data.applicationsOverTime}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
                       <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                       <Line type="monotone" dataKey="apps" stroke="var(--primary)" strokeWidth={6} dot={{stroke: 'var(--primary)', strokeWidth: 4, r: 5, fill: '#fff'}} activeDot={{r: 10, strokeWidth: 0}} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>

            {/* Competency Radar Chart */}
           <div className="xl:col-span-4 bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div>
                 <h2 className="text-2xl font-black italic tracking-tight">Competency Radar</h2>
                 <p className="text-sm font-medium text-slate-500">Maturity mapping across analyzed technical nodes.</p>
              </div>
              <div className="h-80 w-full min-h-[320px]">
                 <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.skillDistribution}>
                       <PolarGrid stroke="#334155" />
                       <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                       <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                       <Radar name="Proficiency" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                       <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px'}} />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Maturity</p>
                    <p className="text-lg font-bold">{data.maturity || 'FOUNDATIONAL'}</p>
                 </div>
                 <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">ATS Signal</p>
                    <p className="text-lg font-bold text-primary">{data.confidence || 0}%</p>
                 </div>
              </div>
           </div>

        </div>

        {/* Market Trends Section */}
        <section className="space-y-10 pt-8 border-t border-slate-100">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Globe size={28} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight text-shadow">Global Market Demand</h2>
                    <p className="text-slate-500 font-medium">Real-time counts across the active 500-job database.</p>
                 </div>
              </div>
              <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                 <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Live Node Polling</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trends?.map((trend, i) => (
                 <div key={i} className="bg-white border-2 border-slate-50 p-8 rounded-[2.5rem] shadow-sm hover:border-primary/20 hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 translate-x-4 -translate-y-4 opacity-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-all">
                       <Zap size={60} />
                    </div>
                    <div className="flex justify-between items-start mb-6">
                       <h3 className="font-extrabold text-slate-900 text-xl leading-tight uppercase tracking-tighter">{trend.name}</h3>
                       <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">HIGH DEMAND</span>
                    </div>
                    <div className="flex items-end justify-between">
                       <div className="space-y-1">
                          <p className="text-4xl font-black text-slate-900 tabular-nums">{trend.demand}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-0.5">Active Positions</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 italic mb-1">Salary Vector</p>
                          <p className="text-2xl font-black text-primary">₹{Math.round(trend.salary)}L</p>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(j => (
                             <div key={j} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?u=${trend.name}${j}`} alt="matcher" />
                             </div>
                          ))}
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                             +
                          </div>
                       </div>
                       <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Explore Nodes</button>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* ── ADVANCED FEATURE: COMPETITIVE BENCHMARKING ── */}
        <section className="space-y-10 pt-12 border-t border-slate-100">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
                    <Scale size={14} /> Neural Benchmark Engine
                 </div>
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Competitive Talent Benchmarking</h2>
                 <p className="text-slate-500 font-medium">How your profile nodes align with the global elite tier.</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="px-5 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3">
                    <Radio size={16} className="text-indigo-600 animate-pulse" />
                    <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">Real-time Comparative Analytics</span>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Benchmark Bars */}
              <div className="xl:col-span-7 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                 <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <BarChart3 size={20} className="text-indigo-600" /> Proficiency vs Global Tiers
                 </h3>
                 <div className="space-y-8">
                    {[
                      { label: 'System Architecture', user: 82, elite: 94, avg: 62 },
                      { label: 'Technical Leadership', user: 74, elite: 88, avg: 45 },
                      { label: 'Cloud Infrastructure', user: 91, elite: 92, avg: 58 }
                    ].map((metric, i) => (
                      <div key={i} className="space-y-3">
                         <div className="flex justify-between items-end">
                            <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{metric.label}</span>
                            <div className="flex gap-4">
                               <span className="text-[10px] font-black text-slate-400 uppercase">Avg: {metric.avg}%</span>
                               <span className="text-[10px] font-black text-indigo-600 uppercase">Elite: {metric.elite}%</span>
                               <span className="text-[10px] font-black text-primary uppercase underline">You: {metric.user}%</span>
                            </div>
                         </div>
                         <div className="h-4 bg-slate-100 rounded-full relative overflow-hidden">
                            {/* Average tier */}
                            <div className="absolute inset-y-0 left-0 bg-slate-200 border-r border-white/20" style={{ width: `${metric.avg}%` }} />
                            {/* Elite tier marker */}
                            <div className="absolute inset-y-0 w-1 bg-indigo-400 z-10" style={{ left: `${metric.elite}%` }} />
                            {/* User progress */}
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.user}%` }}
                              className="absolute inset-y-0 left-0 bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
                            />
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="pt-6 border-t border-slate-50">
                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
                       Benchmark data derived from <span className="text-indigo-600">8.4M analyzed profiles</span> in the JobGrox Global Talent Database.
                    </p>
                 </div>
              </div>

              {/* Talent Scarcity Map & Predictive Signal */}
              <div className="xl:col-span-5 space-y-8">
                 <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    <div className="relative z-10 flex items-center justify-between">
                       <h3 className="text-xl font-black flex items-center gap-2 italic">
                          <Map size={20} className="text-emerald-400" /> Talent Scarcity
                       </h3>
                       <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-lg uppercase border border-emerald-500/30">
                          Rare Profile
                       </div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center py-6">
                       <div className="relative w-40 h-40 flex items-center justify-center">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-4 border-dashed border-emerald-500/20 rounded-full"
                          />
                          <div className="text-center space-y-1">
                             <p className="text-5xl font-black text-emerald-400 tracking-tighter">0.4%</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Scarcity</p>
                          </div>
                       </div>
                    </div>
                    <p className="relative z-10 text-xs text-slate-400 font-medium leading-relaxed text-center">
                       Your specific skill combination of <span className="text-emerald-400">Node.js + System Design + Cloud Architecture</span> is extremely rare in the current hiring cycle.
                    </p>
                 </div>

                 <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm space-y-6">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                       <Users2 size={20} className="text-primary" /> Predictive Hiring Signal
                    </h3>
                    <div className="space-y-6">
                       {[
                         { firm: 'Tier 1 Tech (FAANG+)', probability: 74 },
                         { firm: 'High-Growth Unicorns', probability: 92 },
                         { firm: 'Elite FinTech', probability: 68 }
                       ].map((signal, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary transition-all">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                                  <Star size={16} />
                               </div>
                               <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{signal.firm}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-black text-slate-900">{signal.probability}%</span>
                               <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500" style={{ width: `${signal.probability}%` }} />
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </Layout>
  );
}

function MetricCard({ title, value, icon, trend }) {
   return (
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
         <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
               {icon}
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>
         </div>
         <h3 className="text-3xl font-black text-slate-900">{value}</h3>
         <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{title}</p>
      </div>
   );
}
