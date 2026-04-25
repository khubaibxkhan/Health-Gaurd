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
      `}</style>

      <div style={{ minHeight: '100vh', background: '#F8F7F3', fontFamily: "'DM Sans', sans-serif", paddingBottom: 64 }}>
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
              {quickActions.map((a, i) => (
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
            <div style={{ background: '#fff', border: `0.5px solid ${T.gray100}`, borderRadius: 12, padding: '20px 24px', marginBottom: 0 }}>
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

        </div>
      </div>
    </>
  );
};

export default Dashboard;