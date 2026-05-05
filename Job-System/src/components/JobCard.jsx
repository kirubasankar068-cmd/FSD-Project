import { MapPin, Bookmark, Building2, Lock, Star, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';

import { useAppContext } from '../context/AppContext';

export default function JobCard({ job, userPremium, onApply, index = 0 }) {
  const { toggleSaveJob, isSaved } = useAppContext();
  const saved = isSaved(job._id || job.id);
  const isLocked = job.isPremium && !userPremium;

  const pastelClasses = [
    'job-card-peach',
    'job-card-mint',
    'job-card-lavender',
    'job-card-pink',
    'job-card-blue',
  ];
  const cardClass = pastelClasses[index % pastelClasses.length];

  return (
    <div className={`job-card ${cardClass}`}>
      {/* AI Match Badge */}
      {job.matchScore > 0 && (
        <div className="job-card-match-badge animate-in zoom-in duration-500">
           <Zap size={10} fill="currentColor" />
           {job.matchScore}% AI Match
        </div>
      )}

      {/* Premium Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/40 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 rounded-[2.5rem]">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 text-[var(--primary)] border border-slate-100">
            <Lock size={28} />
          </div>
          <h4 className="text-xl font-bold text-slate-900 tracking-tight italic mb-2">Node Encryption Active</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-4">This premium protocol requires a Professional or Enterprise clearance.</p>
          <Link to="/pricing" className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-[var(--primary-dark)] transition-all uppercase tracking-widest text-[10px]">
            Upgrade Clearance
          </Link>
        </div>
      )}

      {/* Card Header: Date & Bookmark */}
      <div className="job-card-header">
        <span className="job-card-date">
          {job.postedAt || 'Recent'}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); toggleSaveJob(job); }}
          className={`job-card-bookmark ${saved ? 'job-card-bookmark-active' : ''}`}
        >
          <Bookmark size={14} className={saved ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Main Content: Company + Title + Logo */}
      <div className="job-card-body">
        <div className="job-card-info">
          <p className="job-card-company">
            {typeof job.company === 'object' ? (job.company.companyName || job.company.name || 'Company') : (job.company || 'Company')}
          </p>
          <div className="job-card-title-row">
            <h3 className="job-card-title">
              {job.title}
            </h3>
            {job.isPremium && <Star size={12} className="job-card-star" />}
          </div>
        </div>
        <div className="job-card-logo overflow-hidden">
           <SafeImage 
              src={job.companyLogo} 
              alt={job.company} 
              companyName={job.company}
              className="job-card-logo-img" 
              fallbackSize={20}
           />
        </div>
      </div>

      {/* Tags & Why Match */}
      <div className="job-card-tags">
        <span className="job-card-tag-featured">
          {job.category || 'Global Opportunity'}
        </span>
        <span className="job-card-tag">
          {job.type || job.jobType || job.employmentType || 'Full time'}
        </span>
        <span className="job-card-tag">
          {typeof job.experience === 'number' ? `${job.experience}+ Years` : (job.experience || 'Entry level')}
        </span>
      </div>

      {job.whyMatch && job.matchScore > 70 && (
        <div className="job-card-recommendation">
           <Sparkles size={12} className="text-emerald-500" />
           <p className="job-card-recommendation-text">{job.whyMatch}</p>
        </div>
      )}

      {/* Card Footer: Salary & Action */}
      <div className="job-card-footer flex-col sm:flex-row gap-4">
        <div className="job-card-salary-block flex-1">
           <p className="job-card-salary">
             {typeof job.salary === 'number' ? `₹${(job.salary / 100000).toFixed(1)}L+` : (job.salary || 'Negotiable')}
           </p>
           <p className="job-card-location">
             <MapPin size={11} /> {job.location || 'Remote'}
           </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link 
            to={`/job/${job._id || job.id}`}
            onClick={() => addRecentView(job)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors text-center"
          >
            Details
          </Link>
          <button 
            onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              if (typeof onApply === 'function') {
                onApply(); 
              } else {
                console.log('Apply protocol initiated for job:', job.title);
              }
            }}
            className="flex-1 sm:flex-none job-card-apply-btn text-center pt-2.5"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
