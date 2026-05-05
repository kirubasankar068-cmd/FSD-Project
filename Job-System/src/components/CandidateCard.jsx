import { MapPin, Bookmark, User, Star, Zap, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { companyAPI } from '../services/api';

export default function CandidateCard({ candidate, index = 0 }) {
  const [invited, setInvited] = useState(false);
  const isPremium = candidate.experience.includes('Senior') || candidate.matchScore > 85;

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
      {(candidate.matchScore > 0 || isPremium) && (
        <div className="job-card-match-badge animate-in zoom-in duration-500">
           {candidate.matchScore > 0 ? (
             <>
               <Zap size={10} fill="currentColor" />
               {candidate.matchScore}% Match
             </>
           ) : (
             <>
               <Star size={10} fill="currentColor" />
               Top Talent
             </>
           )}
        </div>
      )}

      {/* Card Header */}
      <div className="job-card-header">
        <span className="job-card-date">
          {candidate.category}
        </span>
        <button
          className="job-card-bookmark"
        >
          <Bookmark size={14} />
        </button>
      </div>

      {/* Main Content: Avatar + Name + Title */}
      <div className="job-card-body flex items-start gap-4 pt-2">
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
          <img 
            src={`https://i.pravatar.cc/150?u=${candidate.avatarId}`} 
            alt={candidate.name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`; }}
          />
        </div>
        <div className="job-card-info mt-0">
          <div className="job-card-title-row">
            <h3 className="job-card-title truncate max-w-xs block">
              {candidate.name}
            </h3>
            {isPremium && <Star size={12} className="job-card-star" />}
          </div>
          <p className="job-card-company font-medium text-slate-500 mt-1">{candidate.title}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="job-card-tags mt-5">
        <span className="job-card-tag-featured">
          {candidate.experience}
        </span>
        {candidate.skills?.slice(0, 2).map((skill, i) => (
          <span key={i} className="job-card-tag">
            {skill}
          </span>
        ))}
        {candidate.skills?.length > 2 && (
          <span className="job-card-tag text-slate-400 bg-white/50">
            +{candidate.skills.length - 2}
          </span>
        )}
      </div>

      {candidate.bio && (
        <div className="mt-4 px-1">
           <p className="text-xs font-medium text-slate-600 line-clamp-2 italic leading-relaxed">"{candidate.bio}"</p>
        </div>
      )}

      {/* Card Footer: Action */}
      <div className="job-card-footer flex-col sm:flex-row gap-4 mt-6 border-t border-slate-50/50 pt-6">
        <div className="job-card-salary-block flex-1 flex flex-col justify-center">
           <p className="job-card-location">
             <MapPin size={11} className="text-primary" /> {candidate.location}
           </p>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Placement Tier: {isPremium ? 'Elite' : 'Standard'}</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!invited ? (
            <button 
              onClick={async (e) => { 
                e.preventDefault(); 
                const confirmSelection = window.confirm(`INITIATE PLACEMENT PROTOCOL?\n\nSelecting ${candidate.name} will generate a brokerage node of ₹15,000.\n\nProceed with selection?`);
                if (!confirmSelection) return;

                try {
                  await companyAPI.invite({
                    candidateId: candidate._id,
                    jobId: '65e1a2b3c4d5e6f7a8b90001', 
                    message: `RECRUITMENT PROTOCOL: You have been SELECTED for placement evaluation.`
                  });
                  setInvited(true);
                  alert("SUCCESS: Candidate node synchronized. Financial invoice dispatched to Admin Dashboard.");
                } catch (err) {
                  console.error('Selection failed:', err);
                  alert(err.message || "Selection failed.");
                }
              }}
              className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              Select Node <Zap size={12} fill="currentColor" className="text-primary"/>
            </button>
          ) : (
            <button 
              disabled
              className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
            >
              Selected <CheckCircle2 size={12} strokeWidth={3}/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
