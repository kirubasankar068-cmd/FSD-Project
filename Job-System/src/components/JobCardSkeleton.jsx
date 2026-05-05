export default function JobCardSkeleton() {
  return (
    <div className="job-card-skeleton">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div className="skeleton-pulse" style={{ width: '70px', height: '24px', borderRadius: '20px' }}></div>
        <div className="skeleton-pulse" style={{ width: '32px', height: '32px', borderRadius: '50%' }}></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div className="skeleton-pulse" style={{ width: '60%', height: '12px', marginBottom: '8px' }}></div>
          <div className="skeleton-pulse" style={{ width: '80%', height: '18px' }}></div>
        </div>
        <div className="skeleton-pulse" style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0 }}></div>
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="skeleton-pulse" style={{ width: '70px', height: '24px', borderRadius: '20px' }}></div>
        <div className="skeleton-pulse" style={{ width: '85px', height: '24px', borderRadius: '20px' }}></div>
        <div className="skeleton-pulse" style={{ width: '60px', height: '24px', borderRadius: '20px' }}></div>
      </div>
      <div style={{ paddingTop: '16px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div>
          <div className="skeleton-pulse" style={{ width: '80px', height: '16px', marginBottom: '6px' }}></div>
          <div className="skeleton-pulse" style={{ width: '60px', height: '10px' }}></div>
        </div>
        <div className="skeleton-pulse" style={{ width: '80px', height: '36px', borderRadius: '12px' }}></div>
      </div>
    </div>
  );
}
