import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import SymptomResultCard from '../components/SymptomResultCard';

const T = {
  teal50:'#E1F5EE', teal400:'#1D9E75', teal600:'#0F6E56', teal800:'#085041',
  amber50:'#FAEEDA', amber400:'#BA7517', amber800:'#633806',
  gray50:'#F1EFE8', gray100:'#D3D1C7', gray400:'#888780',
};

const QUICK_SYMPTOMS = [
  'Fever','Headache','Cough','Cold','Fatigue',
  'Nausea','Body ache','Sore throat','Dizziness','Chills',
];

const SectionLabel = ({ children, muted }) => (
  <div style={{ fontSize:11, fontWeight:500, letterSpacing:'1.5px', textTransform:'uppercase',
    color: muted ? T.gray400 : T.teal600, marginBottom:10 }}>
    {children}
  </div>
);

const AIDisclaimer = ({ text }) => (
  <div style={{ background:T.amber50, border:`0.5px solid ${T.amber400}`, borderRadius:12, padding:'14px 18px' }}>
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6,
      fontSize:11, fontWeight:500, color:T.amber800, textTransform:'uppercase', letterSpacing:'.8px' }}>
      <span style={{ width:6, height:6, background:T.amber400, borderRadius:'50%', display:'inline-block' }} />
      Disclaimer
    </div>
    <p style={{ fontSize:13, color:T.amber800, lineHeight:1.65, margin:0 }}>{text}</p>
  </div>
);

const SymptomChecker = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults]   = useState(null);
  const [loading, setLoading]   = useState(false);

  const activeList = symptoms
    ? symptoms.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const toggle = (symptom) => {
    if (activeList.includes(symptom)) {
      setSymptoms(activeList.filter(s => s !== symptom).join(', '));
    } else {
      setSymptoms(prev => prev ? prev + ', ' + symptom : symptom);
    }
  };

  const remove = (symptom) =>
    setSymptoms(activeList.filter(s => s !== symptom).join(', '));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) { toast.error('Please describe your symptoms'); return; }
    try {
      setLoading(true);
      setResults(null);
      const res = await api.post('/symptoms', { symptoms });

      /* ── BUG FIX: normalise whatever shape the API returns ── */
      const data = res.data;
      setResults({
        disclaimer: data.disclaimer || data.message || 'These results are for informational guidance only — not a medical diagnosis.',
        illnesses:  data.illnesses  || data.conditions || data.results || (Array.isArray(data) ? data : []),
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to analyze symptoms');
    } finally {
      setLoading(false);
    }
  };

  /* ── shared input style ── */
  const fieldLabel = { fontSize:11, fontWeight:500, letterSpacing:'1px',
    textTransform:'uppercase', color:T.gray400, marginBottom:10 };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes hpSpin { to { transform: rotate(360deg); } }
        .hp-tag { transition: all .15s ease; cursor: pointer; user-select: none; }
        .hp-tag:hover { transform: translateY(-1px); }
        .hp-tag:active { transform: scale(.97); }
        .hp-textarea:focus { outline: none; border-color: ${T.teal400} !important; box-shadow: 0 0 0 3px ${T.teal50}; }
        .hp-analyze:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,110,86,.25); }
        .hp-analyze:active:not(:disabled) { transform: scale(.97); }
        .hp-analyze { transition: all .2s ease; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#F8F7F3',
        fontFamily:"'DM Sans', sans-serif", paddingBottom:64 }}
        className="md:ml-64">
        <div style={{ maxWidth:860, margin:'0 auto', padding:'40px 24px' }}>

          {/* ── Header ── */}
          <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.4 }} style={{ marginBottom:36 }}>
            <SectionLabel>Symptom Intelligence</SectionLabel>
            <h1 style={{ fontFamily:"'Fraunces', serif", fontSize:38, fontWeight:300,
              letterSpacing:'-1.5px', lineHeight:1.1, color:'#1A1A18', marginBottom:10 }}>
              What are you{' '}
              <em style={{ fontStyle:'italic', color:T.teal600 }}>feeling?</em>
            </h1>
            <p style={{ fontSize:15, color:'#6B6B68', fontWeight:300, margin:0, lineHeight:1.65 }}>
              Select symptoms or describe them below. Our AI analyzes combinations instantly.
            </p>
          </motion.div>

          {/* ── Input card ── */}
          <motion.form onSubmit={handleSubmit}
            initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.4, delay:.06 }}
            style={{ background:'#fff', border:`0.5px solid ${T.gray100}`,
              borderRadius:16, padding:28, marginBottom:20 }}>

            {/* Quick tags */}
            <div style={{ marginBottom:20 }}>
              <div style={fieldLabel}>Quick select</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {QUICK_SYMPTOMS.map(s => {
                  const on = activeList.includes(s);
                  return (
                    <div key={s} className="hp-tag" onClick={() => toggle(s)}
                      style={{ display:'flex', alignItems:'center', gap:6,
                        background: on ? T.teal50 : '#fff',
                        border: `0.5px solid ${on ? T.teal400 : '#C4C3BA'}`,
                        borderRadius:20, padding:'7px 14px',
                        fontSize:13, color: on ? T.teal800 : '#4A4A47',
                        fontWeight: on ? 500 : 400 }}>
                      <span style={{ width:6, height:6, borderRadius:'50%',
                        background: on ? T.teal400 : '#C4C3BA',
                        transition:'background .15s', flexShrink:0 }} />
                      {s}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Textarea */}
            <div style={{ marginBottom:6 }}>
              <div style={fieldLabel}>Or describe in your own words</div>
              <textarea className="hp-textarea"
                value={symptoms}
                onChange={e => setSymptoms(e.target.value.slice(0, 500))}
                placeholder="e.g. I have a high fever, body ache and mild cough since yesterday..."
                rows={3}
                style={{ width:'100%', border:`0.5px solid #C4C3BA`, borderRadius:10,
                  padding:'12px 14px', fontFamily:"'DM Sans', sans-serif",
                  fontSize:14, color:'#1A1A18', resize:'none', background:'#fff',
                  transition:'border-color .15s, box-shadow .15s', boxSizing:'border-box' }}
              />
              <div style={{ fontSize:11.5, color:T.gray400, textAlign:'right', marginTop:4 }}>
                {symptoms.length}/500
              </div>
            </div>

            {/* Active chips */}
            <AnimatePresence>
              {activeList.length > 0 && (
                <motion.div initial={{ opacity:0, height:0 }}
                  animate={{ opacity:1, height:'auto' }}
                  exit={{ opacity:0, height:0 }}
                  style={{ overflow:'hidden', marginBottom:16 }}>
                  <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:4 }}>
                    <span style={{ fontSize:12, color:T.gray400, marginRight:4 }}>Analyzing:</span>
                    {activeList.map(s => (
                      <span key={s} style={{
                        display:'inline-flex', alignItems:'center', gap:5,
                        background:T.teal50, border:`0.5px solid ${T.teal400}`,
                        color:T.teal800, borderRadius:20,
                        padding:'4px 10px', fontSize:12, fontWeight:500 }}>
                        {s}
                        <button onClick={() => remove(s)} type="button"
                          style={{ background:'none', border:'none', cursor:'pointer',
                            color:T.teal600, fontSize:14, lineHeight:1, padding:'0 0 0 2px' }}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button type="submit" disabled={loading} className="hp-analyze"
              style={{ width:'100%', background:T.teal600, color:'#fff', border:'none',
                borderRadius:10, padding:13, fontFamily:"'DM Sans', sans-serif",
                fontSize:14.5, fontWeight:500,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? .7 : 1,
                display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
              {loading ? (
                <>
                  <div style={{ width:15, height:15, border:'2px solid rgba(255,255,255,.3)',
                    borderTop:'2px solid #fff', borderRadius:'50%',
                    animation:'hpSpin .7s linear infinite' }} />
                  Analyzing…
                </>
              ) : 'Analyze symptoms'}
            </button>
          </motion.form>

          {/* ── Results ── */}
          <AnimatePresence>
            {results && (
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0 }} transition={{ duration:.4 }}>

                <div style={{ marginBottom:20 }}>
                  <AIDisclaimer text={results.disclaimer} />
                </div>

                {results.illnesses?.length > 0 ? (
                  <>
                    <SectionLabel>Possible conditions</SectionLabel>
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                      {results.illnesses.map((illness, i) => (
                        <SymptomResultCard
                          key={i}
                          illness={illness}
                          delay={i * 80}
                          onSetReminder={() => navigate(`/reminders?medicine=${encodeURIComponent(illness.suggestedMedicine || '')}`)}
                          onMedicineClick={() => navigate(`/medicines?search=${encodeURIComponent(illness.suggestedMedicine || '')}`)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  /* ── Empty state: API returned no illnesses ── */
                  <div style={{ background:'#fff', border:`0.5px solid ${T.gray100}`,
                    borderRadius:12, padding:'40px 24px', textAlign:'center' }}>
                    <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
                    <div style={{ fontSize:15, fontWeight:500, color:'#1A1A18', marginBottom:6 }}>
                      No conditions matched
                    </div>
                    <p style={{ fontSize:13, color:'#6B6B68', lineHeight:1.65 }}>
                      Try adding more symptoms or describing them differently.
                      If you're concerned, please consult a healthcare professional.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
};

export default SymptomChecker;