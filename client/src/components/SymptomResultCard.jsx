import React, { useState } from 'react';
import { motion } from 'framer-motion';

const T = {
  teal50:'#E1F5EE', teal400:'#1D9E75', teal600:'#0F6E56', teal800:'#085041',
  amber50:'#FAEEDA', amber400:'#BA7517', amber800:'#633806',
  blue50:'#E6F1FB', blue400:'#378ADD', blue800:'#0C447C',
  coral50:'#FAECE7', coral400:'#D85A30', coral800:'#712B13',
  gray50:'#F1EFE8', gray100:'#D3D1C7', gray400:'#888780',
};

const ACCENTS = [
  { color:T.teal400,  textColor:T.teal800,  bg:T.teal50  },
  { color:T.amber400, textColor:T.amber800, bg:T.amber50 },
  { color:T.blue400,  textColor:T.blue800,  bg:T.blue50  },
  { color:T.coral400, textColor:T.coral800, bg:T.coral50 },
];
const ICONS = ['🤧','🌡️','🦠','💊','🧬'];

const SymptomResultCard = ({ illness, onSetReminder, onMedicineClick, delay = 0 }) => {
  const [open, setOpen] = useState(true);
  const idx    = Math.abs((illness.name?.charCodeAt(0) ?? 0)) % ACCENTS.length;
  const accent = ACCENTS[idx];
  const icon   = ICONS[idx];
  const pct    = Math.min(100, Math.round(illness.matchScore ?? illness.confidence ?? 75));

  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:.4, delay: delay/1000, ease:[0.22,1,0.36,1] }}
      style={{ background:'#fff', border:`0.5px solid ${T.gray100}`,
        borderRadius:14, padding:'18px 20px',
        fontFamily:"'DM Sans', sans-serif" }}>

      <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>

        {/* Icon */}
        <div style={{ width:46, height:46, borderRadius:11, background:accent.bg,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:22, flexShrink:0 }}>
          {icon}
        </div>

        <div style={{ flex:1, minWidth:0 }}>

          {/* Title row */}
          <div style={{ display:'flex', alignItems:'center',
            justifyContent:'space-between', gap:8, marginBottom:4 }}>
            <div style={{ fontSize:15.5, fontWeight:500, color:'#1A1A18' }}>
              {illness.name}
            </div>
            <button onClick={() => setOpen(o => !o)}
              style={{ background:'none', border:'none', cursor:'pointer',
                color:T.gray400, fontSize:20, lineHeight:1, flexShrink:0, padding:'0 2px' }}>
              {open ? '−' : '+'}
            </button>
          </div>

          {/* Description */}
          <div style={{ fontSize:13, color:'#6B6B68', lineHeight:1.6, marginTop:4 }}>
            {illness.description}
          </div>

          {/* Match bar */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10 }}>
            <div style={{ flex:1, height:4, background:T.gray50, borderRadius:2 }}>
              <div style={{ height:4, width:`${pct}%`, background:accent.color,
                borderRadius:2, transition:'width 1s ease' }} />
            </div>
            <div style={{ fontSize:12, fontWeight:500, color:accent.textColor,
              minWidth:52, textAlign:'right' }}>
              {pct}% match
            </div>
          </div>

          {/* Expandable precautions */}
          {open && illness.precautions?.length > 0 && (
            <motion.div initial={{ opacity:0, height:0 }}
              animate={{ opacity:1, height:'auto' }}
              transition={{ duration:.2 }}
              style={{ marginTop:14, overflow:'hidden' }}>
              <div style={{ fontSize:11, fontWeight:500, letterSpacing:'1px',
                textTransform:'uppercase', color:T.gray400, marginBottom:8 }}>
                Precautions
              </div>
              {illness.precautions.map((p, i) => (
                <div key={i} style={{ display:'flex', gap:8, fontSize:13,
                  color:'#6B6B68', marginBottom:6, lineHeight:1.55 }}>
                  <div style={{ width:5, height:5, borderRadius:'50%',
                    background:accent.color, flexShrink:0, marginTop:7 }} />
                  {p}
                </div>
              ))}
            </motion.div>
          )}

          {/* Action buttons */}
          {illness.suggestedMedicine && (
            <div style={{ display:'flex', gap:8, marginTop:16 }}>
              <button onClick={onMedicineClick}
                style={{ flex:1, background:accent.bg, color:accent.textColor,
                  border:`0.5px solid ${accent.color}`, borderRadius:8,
                  padding:'9px 12px', fontFamily:"'DM Sans', sans-serif",
                  fontSize:13, fontWeight:500, cursor:'pointer',
                  transition:'all .15s' }}>
                💊 {illness.suggestedMedicine}
              </button>
              <button onClick={onSetReminder}
                style={{ flex:1, background:T.teal600, color:'#fff',
                  border:'none', borderRadius:8, padding:'9px 12px',
                  fontFamily:"'DM Sans', sans-serif", fontSize:13,
                  fontWeight:500, cursor:'pointer', transition:'all .15s' }}>
                Set reminder
              </button>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};

export default SymptomResultCard;