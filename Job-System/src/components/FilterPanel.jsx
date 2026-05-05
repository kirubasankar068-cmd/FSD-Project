import { Check, ChevronDown, Sparkles, X, Globe, Shield, Zap } from 'lucide-react';
import { useState } from 'react';

export default function FilterPanel({ onFilterChange }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    industry: [],
    schedule: []
  });

  const industryOptions = ['IT DEPLOYMENT', 'LOCAL OPERATIONS', 'CORE ENGINEERING', 'BANKING & FINANCE', 'HEALTHCARE & MEDICAL', 'GOVERNMENT SECTOR'];
  const scheduleOptions = ['Full time', 'Part time', 'Contract', 'Remote Uplink'];

  const toggleFilter = (category, value) => {
    const current = selectedFilters[category];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    
    const newFilters = { ...selectedFilters, [category]: updated };
    setSelectedFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const Checkbox = ({ label, checked, onChange }) => (
    <label className="filter-checkbox-row" onClick={onChange}>
      <div className={`filter-checkbox ${checked ? 'filter-checkbox-checked' : ''}`}>
        {checked && <Check size={12} className="text-white" />}
      </div>
      <span className={`filter-checkbox-label ${checked ? 'filter-checkbox-label-active' : ''}`}>
        {label}
      </span>
    </label>
  );

  return (
    <div className="filter-panel">
      {/* Promotional Card */}
      <div className="filter-promo-card">
        <div className="filter-promo-bg"></div>
        <div className="filter-promo-content">
           <h3 className="filter-promo-title">
             Get Your best profession with <span className="filter-promo-highlight">JobGrox</span>
           </h3>
           <button 
             className="filter-promo-btn hover:scale-105 transition-transform"
             onClick={() => setShowModal(true)}
           >
             Learn more
           </button>
        </div>
      </div>

      {/* Filters Header */}
      <div className="filter-header">
        <h2 className="filter-header-title">Filters</h2>
        <button className="filter-header-toggle">
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="filter-groups max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
        {/* Industry Category */}
        <div className="filter-group">
          <p className="filter-group-title">Industry Sector</p>
          <div className="filter-group-options">
            {industryOptions.map(option => (
              <Checkbox 
                key={option} 
                label={option} 
                checked={selectedFilters.industry?.includes(option)} 
                onChange={() => toggleFilter('industry', option)}
              />
            ))}
          </div>
        </div>

        {/* Working Schedule */}
        <div className="filter-group">
          <p className="filter-group-title">Working Schedule</p>
          <div className="filter-group-options">
            {scheduleOptions.map(option => (
              <Checkbox 
                key={option} 
                label={option} 
                checked={selectedFilters.schedule.includes(option)} 
                onChange={() => toggleFilter('schedule', option)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* About JobGrox Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-xl w-full p-10 relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center text-primary transform rotate-3">
                 <Globe size={32} />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-navy tracking-tighter italic">About JobGrox</h2>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Recruitment Network</p>
               </div>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6">
                 <h4 className="text-sm font-black text-navy mb-2 flex items-center gap-2"><Zap size={16} className="text-primary" /> AI Precision Matching</h4>
                 <p className="text-slate-600 text-sm font-medium leading-relaxed">Our proprietary intelligence engine analyzes skill profiles against global requirements, ensuring perfect alignment between elite talent and top-tier corporations.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6">
                 <h4 className="text-sm font-black text-navy mb-2 flex items-center gap-2"><Shield size={16} className="text-emerald-500" /> Verified Opportunities</h4>
                 <p className="text-slate-600 text-sm font-medium leading-relaxed">Every protocol and job listing is manually vetted by our integrity team to guarantee 100% security, high compensation standards, and enterprise-grade career growth.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
