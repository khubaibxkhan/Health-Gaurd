import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';

/* ── Design tokens (mirrors HealthPulse inspiration) ── */
const T = {
  teal50: '#E1F5EE', teal100: '#9FE1CB', teal400: '#1D9E75',
  teal600: '#0F6E56', teal800: '#085041',
  amber50: '#FAEEDA', amber400: '#BA7517', amber800: '#633806',
  blue50: '#E6F1FB', blue400: '#378ADD', blue800: '#0C447C',
  green50: '#EAF3DE', green400: '#639922',
  coral50: '#FAECE7', coral400: '#D85A30',
  gray50: '#F1EFE8', gray100: '#D3D1C7', gray400: '#888780', gray800: '#444441',
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.teal600, marginBottom: 10 }}>
    {children}
  </div>
);

const AIInsight = ({ text }) => (
  <div style={{ background: T.teal50, border: `0.5px solid ${T.teal400}`, borderRadius: 12, padding: '16px 20px', marginTop: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 11, fontWeight: 500, color: T.teal800, textTransform: 'uppercase', letterSpacing: '.8px' }}>
      <span style={{ width: 6, height: 6, background: T.teal400, borderRadius: '50%', display: 'inline-block', animation: 'hpPulse 2s infinite' }} />
      AI Insight
    </div>
    <p style={{ fontSize: 13.5, color: T.teal800, lineHeight: 1.65, margin: 0 }}>{text}</p>
  </div>
);

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const healthTips = [
  '🚶 Walk 10,000 steps daily to maintain cardiovascular health.',
  '💧 Drink at least 8 glasses of water per day to stay hydrated.',
  '😴 Get 7–9 hours of quality sleep every night for full recovery.',
  '🥗 Eat a balanced diet rich in fruits, vegetables, and whole grains.',
  '🏃 Exercise for at least 30 minutes daily to maintain fitness.',
  '🧘 Practice 10 minutes of meditation for mental clarity.',
  '🌞 Get 15–20 minutes of sunlight daily for Vitamin D synthesis.',
  '❌ Limit excess salt and sugar to protect heart and metabolic health.',
  '🤝 Nurture relationships — social health is as important as physical.',
  '⏰ Keep a regular sleep schedule, even on weekends.',
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/reminders');
      setReminders(res.data.slice(0, 3));
      setStats({
        totalReminders: res.data.length,
        symptomCheckCount: user?.symptomCheckCount || 0,
        savedMedicines: user?.savedMedicines?.length || 0,
        isVerified: user?.isVerified,
      });
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todaysTip = healthTips[new Date().getDate() % healthTips.length];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8F7F3' }}>
        <div style={{ width: 36, height: 36, border: `2.5px solid ${T.teal100}`, borderTop: `2.5px solid ${T.teal600}`, borderRadius: '50%', animation: 'hpSpin .8s linear infinite' }} />
        <style>{`@keyframes hpSpin{to{transform:rotate(360deg)}} @keyframes hpPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}`}</style>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Reminders', value: stats?.totalReminders ?? 0, icon: '🔔', color: T.teal600, bg: T.teal50 },
    { label: 'Symptoms Checked', value: stats?.symptomCheckCount ?? 0, icon: '🔍', color: T.blue400, bg: T.blue50 },
    { label: 'Saved Medicines', value: stats?.savedMedicines ?? 0, icon: '💊', color: T.amber400, bg: T.amber50 },
    {
      label: 'Account Status',
      value: stats?.isVerified ? 'Verified' : 'Unverified',
      icon: stats?.isVerified ? '✓' : '⚠',
      color: stats?.isVerified ? T.green400 : T.coral400,
      bg: stats?.isVerified ? T.green50 : T.coral50,
    },
  ];

  const quickActions = [
    { label: 'Check Symptoms', icon: '🔍', path: '/symptom-checker', color: T.teal400, bg: T.teal50 },
    { label: 'Browse Medicines', icon: '💊', path: '/medicines', color: T.blue400, bg: T.blue50 },
    { label: 'Add Reminder', icon: '⏰', path: '/reminders', color: T.amber400, bg: T.amber50 },
  ];

  const reminderStatus = (r) => {
    if (r.status === 'done') return { label: 'Done', bg: T.gray50, color: T.gray800 };
    if (r.status === 'now') return { label: 'Now', bg: T.teal50, color: T.teal800 };
    return { label: r.frequency || 'Active', bg: T.amber50, color: T.amber800 };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes hpSpin { to { transform: rotate(360deg); } }
        @keyframes hpPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
        @keyframes hpFadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .hp-action-card { transition: all .2s ease; cursor: pointer; }
        .hp-action-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,.07); }
        .hp-reminder-row { transition: transform .15s ease; }
        .hp-reminder-row:hover { transform: translateX(4px); }
        .hp-stat-card { transition: all .2s ease; }
        .hp-stat-card:hover { transform: translateY(-2px); }
        .hp-linkedin-btn { transition: all .2s ease; }
        .hp-linkedin-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#F8F7F3', fontFamily: "'DM Sans', sans-serif", paddingBottom: 64 }}
        className="md:ml-64">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

          {/* ── Greeting ── */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} style={{ marginBottom: 40 }}>
            <SectionLabel>Dashboard</SectionLabel>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 40, fontWeight: 300, letterSpacing: '-1.5px', lineHeight: 1.1, color: '#1A1A18', marginBottom: 8 }}>
              {getGreeting()},{' '}
              <em style={{ fontStyle: 'italic', color: T.teal600 }}>{user?.name?.split(' ')[0] || 'there'}</em>
            </h1>
            <p style={{ fontSize: 15, color: '#6B6B68', fontWeight: 300, margin: 0 }}>Welcome back to your health dashboard.</p>
          </motion.div>

          {/* ── Stat Cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
            {statCards.map((s, i) => (
              <motion.div key={s.label} className="hp-stat-card"
                variants={fadeUp} initial="hidden" animate="show" custom={i + 1}
                style={{ background: '#fff', border: `0.5px solid ${T.gray100}`, borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 14 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: '#6B6B68', marginBottom: 6, fontWeight: 400 }}>{s.label}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 400, color: s.color, lineHeight: 1 }}>{s.value}</div>
              </motion.div>
            ))}
          </div>

          {/* ── Quick Actions ── */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.teal600, marginBottom: 14 }}>Quick Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {quickActions.map((a) => (
                <div key={a.label} className="hp-action-card"
                  onClick={() => navigate(a.path)}
                  style={{ background: '#fff', border: `0.5px solid ${T.gray100}`, borderRadius: 12, padding: '22px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{a.icon}</div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 500, color: '#1A1A18', marginBottom: 3 }}>{a.label}</div>
                    <div style={{ fontSize: 12, color: T.gray400 }}>Tap to open →</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Recent Reminders ── */}
          {reminders.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6} style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.teal600 }}>Recent Reminders</div>
                <button onClick={() => navigate('/reminders')}
                  style={{ background: 'none', border: 'none', fontSize: 12, color: T.teal600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                  View all →
                </button>
              </div>
              <div style={{ background: '#fff', border: `0.5px solid ${T.gray100}`, borderRadius: 12, overflow: 'hidden' }}>
                {reminders.map((r, i) => {
                  const st = reminderStatus(r);
                  return (
                    <div key={r._id} className="hp-reminder-row"
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderTop: i === 0 ? 'none' : `0.5px solid ${T.gray50}` }}>
                      <div style={{ background: T.teal50, color: T.teal800, borderRadius: 8, padding: '6px 10px', fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 400, minWidth: 54, textAlign: 'center' }}>
                        {r.time || '—'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1A18', marginBottom: 2 }}>{r.medicineName}</div>
                        <div style={{ fontSize: 12, color: '#6B6B68' }}>{r.dosage}</div>
                      </div>
                      <div style={{ fontSize: 11.5, fontWeight: 500, padding: '4px 12px', borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0 }}>{st.label}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── This Week's Adherence ── */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7} style={{ marginBottom: 0 }}>
            <div style={{ background: '#fff', border: `0.5px solid ${T.gray100}`, borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: 11, color: T.gray400, marginBottom: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.8px' }}>This week's adherence</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 60 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const heights = [100, 75, 100, 50, 100, 100, 60];
                  const colors = [T.teal400, T.teal400, T.teal400, T.amber400, T.teal400, T.teal400, T.gray100];
                  return (
                    <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: '100%', height: `${heights[i]}%`, background: colors[i], borderRadius: '3px 3px 0 0', minHeight: 6, transition: 'height .4s ease' }} />
                      <div style={{ fontSize: 10, color: T.gray400 }}>{day}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Health Tip ── */}
            <AIInsight text={todaysTip} />
          </motion.div>

          {/* ── Footer ── */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={8}
            style={{ marginTop: 48, paddingTop: 24, borderTop: `0.5px solid ${T.gray100}`, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: T.gray400, marginBottom: 14, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 500 }}>
              Built by
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>

              {/* Khubaib */}
              <a
                href="https://www.linkedin.com/in/khubaibxkhan/"
                target="_blank"
                rel="noreferrer"
                className="hp-linkedin-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
                  background: '#fff', border: `0.5px solid ${T.gray100}`,
                  borderRadius: 24, padding: '9px 18px',
                  fontSize: 13, fontWeight: 500, color: '#0A66C2' }}>
                <LinkedInIcon />
                Khubaib
              </a>

              <span style={{ fontSize: 16, color: T.gray100 }}>×</span>

              {/* Raina */}
              <a
                href="hhttps://www.linkedin.com/in/raina-maryam-66a264347/"
                target="_blank"
                rel="noreferrer"
                className="hp-linkedin-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
                  background: '#fff', border: `0.5px solid ${T.gray100}`,
                  borderRadius: 24, padding: '9px 18px',
                  fontSize: 13, fontWeight: 500, color: '#0A66C2' }}>
                <LinkedInIcon />
                Raina
              </a>
            </div>

            <p style={{ fontSize: 11, color: T.gray400, marginTop: 16, marginBottom: 0 }}>
              HealthGuard AI · {new Date().getFullYear()}
            </p>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;