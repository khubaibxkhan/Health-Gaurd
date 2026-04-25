import React from 'react';

const SkeletonCard = () => (
  <>
    <style>{`
      @keyframes hpShimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .hp-skeleton-wrap { position: relative; overflow: hidden; }
      .hp-skeleton-wrap::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.6) 50%, transparent 100%);
        animation: hpShimmer 1.4s ease infinite;
      }
    `}</style>

    <div style={{ background: '#fff', border: '0.5px solid #D3D1C7', borderRadius: 14, padding: 20, fontFamily: "'DM Sans', sans-serif" }}>
      {/* accent bar */}
      <div className="hp-skeleton-wrap" style={{ height: 3, background: '#E8E7E1', borderRadius: 2, marginBottom: 16, width: '40%' }} />

      {/* brand name */}
      <div className="hp-skeleton-wrap" style={{ height: 18, background: '#E8E7E1', borderRadius: 6, marginBottom: 10, width: '65%' }} />

      {/* generic name */}
      <div className="hp-skeleton-wrap" style={{ height: 13, background: '#E8E7E1', borderRadius: 6, marginBottom: 10, width: '45%' }} />

      {/* manufacturer badge */}
      <div className="hp-skeleton-wrap" style={{ height: 22, background: '#E8E7E1', borderRadius: 20, marginBottom: 16, width: '35%' }} />

      {/* purpose lines */}
      <div className="hp-skeleton-wrap" style={{ height: 13, background: '#E8E7E1', borderRadius: 6, marginBottom: 8, width: '100%' }} />
      <div className="hp-skeleton-wrap" style={{ height: 13, background: '#E8E7E1', borderRadius: 6, marginBottom: 20, width: '80%' }} />

      {/* button */}
      <div className="hp-skeleton-wrap" style={{ height: 40, background: '#E8E7E1', borderRadius: 9, width: '100%' }} />
    </div>
  </>
);

export default SkeletonCard;