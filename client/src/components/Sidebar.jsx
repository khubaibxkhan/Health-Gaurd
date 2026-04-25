import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const T = {
  teal50: '#E1F5EE', teal100: '#9FE1CB', teal400: '#1D9E75',
  teal600: '#0F6E56', teal800: '#085041',
  gray50: '#F1EFE8', gray100: '#D3D1C7', gray400: '#888780',
};

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Symptom Checker', path: '/symptom-checker', icon: '🔍' },
    { label: 'Medicines', path: '/medicines', icon: '💊' },
    { label: 'Reminders', path: '/reminders', icon: '⏰' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes hpPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .hp-nav-link { transition: color .15s ease; position: relative; }
        .hp-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 1.5px;
          background: ${T.teal400};
          transform: scaleX(0);
          transition: transform .2s ease;
          border-radius: 2px;
        }
        .hp-nav-link.active::after,
        .hp-nav-link:hover::after { transform: scaleX(1); }
        .hp-nav-link.active { color: ${T.teal600} !important; font-weight: 500; }
        .hp-nav-link:hover { color: ${T.teal600} !important; }
        .hp-logout-btn { transition: all .15s ease; }
        .hp-logout-btn:hover { background: #fee2e2 !important; color: #b91c1c !important; }
        .hp-mobile-item { transition: background .15s ease; }
        .hp-mobile-item:hover { background: ${T.teal50} !important; }
        .hp-hamburger span { display: block; width: 20px; height: 1.5px; background: #1A1A18; border-radius: 2px; transition: all .25s ease; }
        .hp-avatar { transition: box-shadow .2s ease; }
        .hp-avatar:hover { box-shadow: 0 0 0 3px ${T.teal100}; }
      `}</style>

      {/* ── Top Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(248,247,243,.95)' : '#F8F7F3',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: `0.5px solid ${scrolled ? T.gray100 : 'transparent'}`,
        transition: 'all .3s ease',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, background: T.teal400, borderRadius: '50%', display: 'inline-block', animation: 'hpPulse 2.5s infinite', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, letterSpacing: '-.3px', color: '#1A1A18', lineHeight: 1.1 }}>
                HealthGuard AI
              </div>
              <div style={{ fontSize: 10, color: T.gray400, letterSpacing: '.3px' }}>Your health companion</div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="hp-desktop-nav">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`hp-nav-link${isActive(item.path) ? ' active' : ''}`}
                style={{ textDecoration: 'none', fontSize: 13.5, color: '#6B6B68', fontWeight: 400, paddingBottom: 2 }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Avatar + Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {user.avatar ? (
                  <img
                    src={`http://localhost:5000${user.avatar}`}
                    alt="Avatar"
                    className="hp-avatar"
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', border: `1.5px solid ${T.gray100}` }}
                    onClick={() => navigate('/profile')}
                  />
                ) : (
                  <div
                    className="hp-avatar"
                    onClick={() => navigate('/profile')}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: T.teal50, border: `1.5px solid ${T.teal100}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: T.teal800, cursor: 'pointer' }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Show name only on larger screens */}
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1A18' }} className="hp-username">
                  {user.name?.split(' ')[0]}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="hp-logout-btn"
              style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '7px 16px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}
            >
              Logout
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="hp-hamburger"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'none', flexDirection: 'column', gap: 5 }}
              aria-label="Toggle menu"
            >
              <span style={{ transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <span style={{ opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : 'none' }} />
              <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div style={{ background: '#F8F7F3', borderTop: `0.5px solid ${T.gray100}`, padding: '12px 24px 16px', animation: 'slideDown .2s ease both' }}>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0 14px', borderBottom: `0.5px solid ${T.gray100}`, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.teal50, border: `1.5px solid ${T.teal100}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: T.teal800, flexShrink: 0 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1A1A18' }}>{user.name}</div>
                  <div style={{ fontSize: 11.5, color: T.gray400 }}>{user.email}</div>
                </div>
              </div>
            )}

            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="hp-mobile-item"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 12px', borderRadius: 8, textDecoration: 'none',
                  color: isActive(item.path) ? T.teal800 : '#4A4A47',
                  background: isActive(item.path) ? T.teal50 : 'transparent',
                  fontWeight: isActive(item.path) ? 500 : 400,
                  fontSize: 14, marginBottom: 2,
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              style={{ width: '100%', marginTop: 10, background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '10px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Spacer so page content doesn't hide under fixed navbar */}
      <div style={{ height: 64 }} />

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .hp-desktop-nav { display: none !important; }
          .hp-username { display: none !important; }
          .hp-hamburger { display: flex !important; }
          .hp-logout-btn { display: none !important; }
        }
        @media (min-width: 769px) {
          .hp-hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;