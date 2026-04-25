import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/* ── Design tokens ── */
const T = {
  teal400: "#1D9E75", teal600: "#0F6E56", teal800: "#085041",
  gray50: "#F1EFE8", gray100: "#D3D1C7", gray400: "#888780",
};

/* ── Global font injection (once) ── */
const injectFonts = () => {
  if (document.getElementById('hg-fonts')) return;
  const link = document.createElement('link');
  link.id = 'hg-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=DM+Sans:wght@300;400;500&display=swap';
  document.head.appendChild(link);
};

const navItems = [
  { path: '/dashboard',       icon: '📊', label: 'Dashboard' },
  { path: '/symptom-checker', icon: '🔍', label: 'Symptoms'  },
  { path: '/medicines',       icon: '💊', label: 'Medicines' },
  { path: '/reminders',       icon: '⏰', label: 'Reminders' },
  { path: '/profile',         icon: '👤', label: 'Profile'   },
];

/* ══════════════════════════════════════
   TOP NAV  — desktop (md and above)
══════════════════════════════════════ */
export const TopNav = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    injectFonts();
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(248,247,243,.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? `0.5px solid ${T.gray100}` : 'none',
      transition: 'all .3s ease',
      padding: '0 24px',
      display: 'none',        // hidden on mobile
    }}
      className="md:block"   // visible on md+
    >
      {/* Scroll progress bar */}
      <ScrollProgress />

      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, background: T.teal400, borderRadius: '50%', animation: 'hg-pulse 2.5s infinite' }} />
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, letterSpacing: '-.3px', lineHeight: 1.1, color: '#1A1A18' }}>
              Health Guard
            </div>
            <div style={{ fontSize: 10, color: T.gray400, letterSpacing: '.3px' }}>Your intelligent health companion</div>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 28, fontSize: 13.5 }}>
          {navItems.map(({ path, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} style={{
                textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                color: active ? T.teal600 : '#6B6B68',
                fontWeight: active ? 500 : 400,
                padding: '4px 0',
                borderBottom: active ? `1.5px solid ${T.teal400}` : '1.5px solid transparent',
                transition: 'color .15s',
              }}>
                {label}
              </Link>
            );
          })}
        </div>

        <button style={{
          background: T.teal600, color: '#fff', border: 'none',
          padding: '9px 20px', borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}>
          Get started free
        </button>
      </div>

      <style>{`@keyframes hg-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}`}</style>
    </nav>
  );
};

/* ══════════════════════════════════════
   BOTTOM NAV  — mobile only
══════════════════════════════════════ */
const Navbar = () => {
  const location = useLocation();

  useEffect(() => { injectFonts(); }, []);

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: '#fff',
      borderTop: `0.5px solid ${T.gray100}`,
      boxShadow: '0 -2px 16px rgba(0,0,0,.04)',
      display: 'flex',
    }}
      className="md:hidden"
    >
      {navItems.map(({ path, icon, label }) => {
        const active = location.pathname === path;
        return (
          <Link key={path} to={path} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '10px 0', gap: 4, textDecoration: 'none',
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: active ? 500 : 400,
            color: active ? T.teal600 : '#6B6B68',
            borderTop: `2px solid ${active ? T.teal400 : 'transparent'}`,
            transition: 'all .15s',
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

/* ── Scroll progress (used inside TopNav) ── */
const ScrollProgress = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5, background: T.gray100 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: T.teal400, transition: 'width .1s linear' }} />
    </div>
  );
};

export default Navbar;