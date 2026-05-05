export default function Skeleton({ variant = 'text', className = '' }) {
  const baseClasses = 'animate-pulse bg-white/5';
  
  const variants = {
    text: 'h-4 w-full rounded-md',
    title: 'h-8 w-3/4 rounded-lg',
    avatar: 'rounded-2xl',
    card: 'rounded-[2rem] h-64 w-full',
    button: 'h-11 w-32 rounded-xl',
    input: 'h-14 w-full rounded-2xl',
  };

  return (
    <div className={`${baseClasses} ${variants[variant] || ''} ${className}`} />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="premium-card p-6 h-full flex flex-col relative overflow-hidden">
      <div className="flex gap-4 items-start mb-6">
        <Skeleton variant="avatar" className="w-16 h-16 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton variant="title" className="w-2/3" />
          <Skeleton variant="text" className="w-1/3 h-3" />
        </div>
      </div>
      
      <div className="flex gap-3 mb-6">
        <Skeleton variant="text" className="w-20 h-8 rounded-lg" />
        <Skeleton variant="text" className="w-24 h-8 rounded-lg" />
      </div>
      
      <div className="space-y-3 mb-8">
        <Skeleton variant="text" className="w-full h-3" />
        <Skeleton variant="text" className="w-5/6 h-3" />
      </div>
      
      <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-16 h-2" />
          <Skeleton variant="text" className="w-24 h-5" />
        </div>
        <div className="flex gap-3">
          <Skeleton variant="button" className="w-24" />
          <Skeleton variant="button" className="w-32" />
        </div>
      </div>
    </div>
  );
}

export function JobListSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="premium-card p-6 flex flex-col space-y-4">
            <Skeleton variant="text" className="w-1/3 h-2" />
            <Skeleton variant="title" className="w-1/2 h-8" />
          </div>
        ))}
      </div>
      
      <div className="premium-card p-8">
        <Skeleton variant="title" className="w-48 h-8 mb-8" />
        <JobListSkeleton count={3} />
      </div>
    </div>
  );
}
