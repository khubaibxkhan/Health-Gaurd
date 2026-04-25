import React from 'react';
import { motion } from 'framer-motion';

const T = {
  teal50: '#E1F5EE', teal100: '#9FE1CB', teal400: '#1D9E75',
  teal600: '#0F6E56', teal800: '#085041',
  amber50: '#FAEEDA', amber400: '#BA7517',
  blue50: '#E6F1FB', blue400: '#378ADD',
  coral50: '#FAECE7', coral400: '#D85A30',
  gray50: '#F1EFE8', gray100: '#D3D1C7', gray400: '#888780',
};

const ACCENTS = [
  { color: T.teal400, bg: T.teal50, text: T.teal800 },
  { color: T.blue400, bg: T.blue50, text: '#0C447C' },
  { color: T.amber400, bg: T.amber50, text: '#633806' },
  { color: T.coral400, bg: T.coral50, text: '#712B13' },
];

const MedicineCard = ({ medicine, onViewDetails, delay = 0 }) => {
  const acc = ACCENTS[(medicine.brandName?.charCodeAt(0) ?? 0) % ACCENTS.length];

  return (
    <>
      <style>{`
        .hp-med-card { transition: all .2s ease; }
        .hp-med-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,.07) !important; }
        .hp-med-details-btn { transition: all .15s ease; }
        .hp-med-details-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(15,110,86,.2); }
      `}</style>

      <motion.div
        className="hp-med-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: '#fff', border: `0.5px solid ${T.gray100}`, borderRadius: 14, padding: '20px', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', gap: 0 }}
      >
        {/* Top accent bar */}
        <div style={{ height: 3, background: acc.color, borderRadius: 2, marginBottom: 16, width: '40%' }} />

        {/* Brand name */}
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1A18', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {medicine.brandName}
        </div>

        {/* Generic name */}
        <div style={{ fontSize: 12.5, color: T.gray400, marginBottom: 4 }}>{medicine.genericName}</div>

        {/* Manufacturer badge */}
        {medicine.manufacturer && (
          <div style={{ display: 'inline-flex', alignItems: 'center', background: acc.bg, color: acc.text, borderRadius: 20, padding: '3px 10px', fontSize: 11.5, fontWeight: 500, marginBottom: 14, alignSelf: 'flex-start' }}>
            {medicine.manufacturer}
          </div>
        )}

        {/* Purpose */}
        <div style={{ fontSize: 13, color: '#6B6B68', lineHeight: 1.6, flex: 1, marginBottom: 18,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {medicine.purpose}
        </div>

        {/* CTA */}
        <button className="hp-med-details-btn" onClick={onViewDetails}
          style={{ width: '100%', background: T.teal600, color: '#fff', border: 'none', borderRadius: 9, padding: '10px', fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}>
          View Details →
        </button>
      </motion.div>
    </>
  );
};

export default MedicineCard;