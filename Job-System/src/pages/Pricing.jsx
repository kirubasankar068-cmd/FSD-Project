import { useState, useEffect } from 'react';
import { Check, Zap, Building2, Crown, ArrowRight, X, Loader2, Sparkles, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Pricing() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info', featuresUnlocked: null, plan: null });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {}
    }
  }, []);

  const handlePlanSelect = async (plan) => {
    if (!user) { navigate('/login'); return; }
    if (plan.name === 'Free') return; // Cannot 'upgrade' to free if already on it
    
    setLoading(true);
    try {
      // Mock Payment Process to guarantee success and feature unlocking
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // Update Sync State locally to unlock features immediately
      const updatedUser = { ...user, isPremium: true, premiumPlan: plan.name.toLowerCase() };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Dispatch global event for Real-Time UI Sync
      window.dispatchEvent(new Event('userUpdate'));

      setModalContent({
        title: 'Clearance Granted',
        message: `Your account has been successfully upgraded to the ${plan.name} Tier! All premium enterprise nodes and high-priority jobs are now decrypted and ready for access.`,
        type: 'success',
        featuresUnlocked: plan.features,
        plan: plan.name
      });
      setShowModal(true);
    } catch (err) {
      console.error('Subscription Error:', err);
      setModalContent({
        title: 'Protocol Failure',
        message: err.message || "An error occurred during the synchronization protocol.",
        type: 'error',
        featuresUnlocked: null,
        plan: null
      });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setShowModal(false);

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      icon: Zap,
      features: ['Browse all positions', 'Basic candidate profile', 'Standard email alerts', 'Up to 5 applications/mo', 'Community support'],
      cta: 'Current Plan',
      popular: false
    },
    {
      name: 'Professional',
      price: '₹999',
      period: 'per month',
      icon: Sparkles,
      features: ['Everything in Free', 'Unlimited applications', 'Priority visibility to recruiters', 'AI Resume optimization', 'Direct messaging to HR', 'Weekly career insights'],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '₹2,999',
      period: 'per year',
      icon: Shield,
      features: ['Everything in Pro', 'Verified Expert badge', 'Dedicated career coach', 'Interview coaching sessions', 'Exclusive VIP job access', 'Early access to new features'],
      cta: 'Go Enterprise',
      popular: false
    }
  ];

  return (
    <Layout>
      <div className="space-y-16 animate-in fade-in duration-700 bg-white min-h-screen">
        <div className="text-center space-y-4 pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-light)] border border-[var(--primary-light)] rounded-full mb-4">
             <Shield size={16} className="text-[var(--primary)]" />
             <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest">Pricing Strategy Transparency</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Precision <span className="text-[var(--primary)]">Strategy</span></h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto italic">Scale your career with elite resources designed for high-impact growth.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-[3rem] p-12 border transition-all flex flex-col justify-between ${
                plan.popular 
                  ? 'border-[var(--primary)] shadow-2xl shadow-primary/10 scale-105 z-10' 
                  : 'border-slate-100 shadow-xl shadow-slate-200/50'
              }`}
            >
              <div className="space-y-8">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${plan.popular ? 'bg-[var(--primary-light)] border border-[var(--primary-light)]' : 'bg-slate-50 border border-slate-100'}`}>
                  <plan.icon size={32} className={plan.popular ? 'text-[var(--primary)]' : 'text-slate-400'} />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-slate-900 tracking-tighter">{plan.price}</span>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{plan.period}</span>
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                <ul className="space-y-5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 bg-[var(--primary-light)] rounded-full p-1">
                        <Check className="text-[var(--primary)] shrink-0" size={14} />
                      </div>
                      <span className="text-slate-600 text-[15px] font-medium leading-tight">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => handlePlanSelect(plan)}
                disabled={loading || (plan.cta === 'Current Plan' && user?.plan === plan.name)}
                className={`mt-12 w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 ${
                  plan.popular 
                    ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-xl shadow-primary/20' 
                    : (plan.cta === 'Current Plan' && user?.plan === plan.name) ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (user?.plan === plan.name ? 'Active Plan' : plan.cta)}
                {user?.plan !== plan.name && !loading && <ArrowRight size={20} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-3xl border border-slate-100 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight italic">{modalContent.title}</h3>
              <button onClick={closeModal} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            
            <p className="text-lg text-slate-600 font-medium leading-relaxed italic">"{modalContent.message}"</p>
            
            {modalContent.type === 'success' && modalContent.featuresUnlocked && (
              <div className="space-y-4 mt-6 text-left bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
                 <h4 className="text-xs font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <Zap size={14} />
                   Futuristic Features Unlocked
                 </h4>
                 {modalContent.featuresUnlocked.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 100}ms` }}>
                       <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Check size={12} className="text-emerald-600" />
                       </div>
                       <span className="text-slate-700 text-sm font-bold tracking-tight">{f}</span>
                    </div>
                 ))}
              </div>
            )}
            
            <button 
              onClick={closeModal}
              className="w-full py-5 bg-[var(--primary)] text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-[var(--primary-dark)] transition-all active:scale-95"
            >
              Acknowledge & Sync
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}



