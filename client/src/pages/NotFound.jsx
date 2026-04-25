import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const T = {
  teal50: '#E1F5EE', teal400: '#1D9E75', teal600: '#0F6E56',
  gray100: '#D3D1C7', gray400: '#888780',
};

const NotFound = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
      @keyframes hpPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.3)} }
      @keyframes hpFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      .hp-home-btn { transition: all .2s ease; }
      .hp-home-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,110,86,.25); }
    `}</style>

    <div style={{ minHeight: '100vh', background: '#F8F7F3', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', maxWidth: 480 }}>

        {/* Animated 404 */}
        <div style={{ position: 'relative', marginBottom: 32, display: 'inline-block' }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 120, fontWeight: 300, color: T.teal50, lineHeight: 1, letterSpacing: '-4px', userSelect: 'none' }}>404</div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 48, animation: 'hpFloat 3s ease-in-out infinite' }}>🔍</div>
          </div>
        </div>

        {/* Pulsing dot */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ width: 8, height: 8, background: T.teal400, borderRadius: '50%', display: 'inline-block', animation: 'hpPulse 2s infinite' }} />
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.teal600 }}>Page Not Found</div>
        </div>

        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 300, letterSpacing: '-1px', color: '#1A1A18', marginBottom: 12, lineHeight: 1.2 }}>
          This page doesn't<br /><em style={{ fontStyle: 'italic', color: T.teal600 }}>exist.</em>
        </h1>

        <p style={{ fontSize: 15, color: '#6B6B68', lineHeight: 1.7, marginBottom: 36, fontWeight: 300 }}>
          The page you're looking for may have been moved, deleted, or never existed. Let's get you back on track.
        </p>

        <Link to="/dashboard" className="hp-home-btn"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.teal600, color: '#fff', textDecoration: 'none', padding: '13px 32px', borderRadius: 10, fontSize: 14.5, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
          ← Go to Dashboard
        </Link>

        {/* Decorative dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 40 }}>
          {[1, 0.4, 0.2].map((op, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: T.teal400, opacity: op }} />
          ))}
        </div>
      </motion.div>
    </div>
  </>
);

export default NotFound;