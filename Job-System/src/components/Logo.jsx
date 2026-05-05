import logoImg from '../assets/logo.png';

export default function Logo({ className = "", showText = true }) {
  return (
    <div className={`logo-wrapper flex items-center shrink-0 ${className}`}>
      <div className="logo-inner flex items-center gap-2.5">
        <img 
          src={logoImg} 
          alt="JobGrox Logo" 
          className="h-8 sm:h-9 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-sm"
        />
        {showText && (
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Job<span className="text-[var(--primary)]">Grox</span>
          </span>
        )}
      </div>
    </div>
  );
}