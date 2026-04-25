import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const T = {
  teal50: '#E1F5EE', teal100: '#9FE1CB', teal400: '#1D9E75',
  teal600: '#0F6E56', teal800: '#085041',
  amber50: '#FAEEDA', amber400: '#BA7517', amber800: '#633806',
  blue50: '#E6F1FB', blue400: '#378ADD', blue800: '#0C447C',
  coral50: '#FAECE7', coral400: '#D85A30',
  gray50: '#F1EFE8', gray100: '#D3D1C7', gray400: '#888780',
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};

const SECTIONS = [
  { key: 'indicationsAndUsage',      label: 'What is it for?',    icon: '❓', accent: T.teal400,  bg: T.teal50  },
  { key: 'dosageAndAdministration',  label: 'How to take',         icon: '💊', accent: T.blue400,  bg: T.blue50  },
  { key: 'warnings',                 label: 'Warnings',            icon: '⚠️', accent: T.amber400, bg: T.amber50 },
  { key: 'adverseReactions',         label: 'Side Effects',        icon: '😟', accent: T.coral400, bg: T.coral50 },
  { key: 'contraindications',        label: 'Contraindications',   icon: '🚫', accent: '#E24B4A',  bg: '#FCEBEB' },
  { key: 'howSupplied',              label: 'Storage',             icon: '🗄️', accent: T.gray400,  bg: T.gray50  },
];

const AccordionItem = ({ section, content, open, onToggle }) => (
  <div style={{ background: '#fff', border: `0.5px solid ${open ? section.accent : T.gray100}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color .2s' }}>
    <button onClick={onToggle}
      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: section.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{section.icon}</div>
        <span style={{ fontSize: 14.5, fontWeight: 500, color: '#1A1A18' }}>{section.label}</span>
      </div>
      <span style={{ fontSize: 18, color: T.gray400, transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'none', lineHeight: 1 }}>+</span>
    </button>
    <AnimatePresence>
      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
          <div style={{ padding: '0 20px 18px', borderTop: `0.5px solid ${T.gray50}` }}>
            <p style={{ fontSize: 13.5, color: '#6B6B68', lineHeight: 1.75, marginTop: 14, whiteSpace: 'pre-wrap' }}>{content || 'No information available.'}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const MedicineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState('indicationsAndUsage');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => { fetchMedicineDetail(); }, [id]);

  const fetchMedicineDetail = async () => {
    try {
      const res = await api.get(`/medicines/${id}`);
      setMedicine(res.data);
    } catch {
      toast.error('Failed to fetch medicine details');
      navigate('/medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await api.delete(`/medicines/save/${medicine.id}`);
        setIsSaved(false);
        toast.success('Removed from saved');
      } else {
        await api.post('/medicines/save', { name: medicine.brandName, id: medicine.id });
        setIsSaved(true);
        toast.success('Medicine saved!');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8F7F3' }}>
      <div style={{ width: 36, height: 36, border: `2.5px solid ${T.teal100}`, borderTop: `2.5px solid ${T.teal600}`, borderRadius: '50%', animation: 'hpSpin .8s linear infinite' }} />
      <style>{`@keyframes hpSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!medicine) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8F7F3', fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ color: '#6B6B68' }}>Medicine not found.</p>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes hpSpin { to { transform: rotate(360deg); } }
        .hp-back-btn { transition: color .15s; }
        .hp-back-btn:hover { color: ${T.teal600} !important; }
        .hp-action-btn { transition: all .2s ease; }
        .hp-action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(15,110,86,.2); }
        .hp-save-btn { transition: all .15s ease; }
        .hp-save-btn:hover { background: ${T.teal50} !important; border-color: ${T.teal400} !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#F8F7F3', fontFamily: "'DM Sans', sans-serif", paddingBottom: 64 }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px' }}>

          {/* Back */}
          <motion.button variants={fadeUp} initial="hidden" animate="show" custom={0}
            onClick={() => navigate('/medicines')} className="hp-back-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, color: T.gray400, fontFamily: "'DM Sans', sans-serif", marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
            ← Back to Medicines
          </motion.button>

          {/* Hero card */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
            style={{ background: '#fff', border: `0.5px solid ${T.gray100}`, borderRadius: 16, padding: '28px', marginBottom: 20 }}>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: T.teal50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>💊</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.teal600, marginBottom: 6 }}>Medicine Detail</div>
                <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 400, letterSpacing: '-1px', color: '#1A1A18', marginBottom: 6, lineHeight: 1.1 }}>{medicine.brandName}</h1>
                <p style={{ fontSize: 14, color: '#6B6B68', marginBottom: 4 }}>{medicine.genericName}</p>
                {medicine.manufacturer && (
                  <div style={{ display: 'inline-flex', background: T.gray50, border: `0.5px solid ${T.gray100}`, borderRadius: 20, padding: '3px 12px', fontSize: 12, color: T.gray400 }}>
                    {medicine.manufacturer}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="hp-action-btn"
                onClick={() => navigate(`/reminders?medicine=${encodeURIComponent(medicine.brandName)}`)}
                style={{ flex: 1, background: T.teal600, color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                ⏰ Set Reminder
              </button>
              <button className="hp-save-btn"
                onClick={handleSave}
                style={{ flex: 1, background: isSaved ? T.teal50 : '#fff', color: isSaved ? T.teal800 : '#4A4A47', border: `0.5px solid ${isSaved ? T.teal400 : '#C4C3BA'}`, borderRadius: 10, padding: '12px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                {isSaved ? '❤️ Saved' : '🤍 Save Medicine'}
              </button>
            </div>
          </motion.div>

          {/* Accordion sections */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
            style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {SECTIONS.map(sec => (
              <AccordionItem
                key={sec.key}
                section={sec}
                content={medicine[sec.key]}
                open={openSection === sec.key}
                onToggle={() => setOpenSection(openSection === sec.key ? null : sec.key)}
              />
            ))}
          </motion.div>

          {/* FDA disclaimer */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            style={{ background: T.blue50, border: `0.5px solid ${T.blue400}`, borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 11, fontWeight: 500, color: T.blue800, textTransform: 'uppercase', letterSpacing: '.8px' }}>
              <span style={{ width: 6, height: 6, background: T.blue400, borderRadius: '50%', display: 'inline-block' }} />
              FDA Disclaimer
            </div>
            <p style={{ fontSize: 13, color: T.blue800, lineHeight: 1.65, margin: 0 }}>
              This medicine information is sourced from the FDA. Always consult a licensed healthcare professional before using any medication.
            </p>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default MedicineDetail;