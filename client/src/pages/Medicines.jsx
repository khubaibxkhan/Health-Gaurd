import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import MedicineCard from '../components/MedicineCard';
import SkeletonCard from '../components/SkeletonCard';

const T = {
  teal50: '#E1F5EE', teal100: '#9FE1CB', teal400: '#1D9E75',
  teal600: '#0F6E56', teal800: '#085041',
  gray50: '#F1EFE8', gray100: '#D3D1C7', gray400: '#888780',
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } }),
};

const POPULAR = ['Ibuprofen', 'Cetirizine', 'Omeprazole', 'Azithromycin', 'Metformin', 'Paracetamol' ];

const Medicines = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => { if (initialSearch) handleSearch(initialSearch); }, []);

  const handleSearch = async (query = search) => {
    if (!query.trim()) { toast.error('Please enter a medicine name'); return; }
    try {
      setLoading(true);
      setHasSearched(true);
      const res = await api.get(`/medicines/search?q=${encodeURIComponent(query)}`);
      setMedicines(res.data.medicines || []);
      if (!res.data.medicines?.length) toast.info('No medicines found. Try another search.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePopular = (name) => { setSearch(name); handleSearch(name); };
  const handleSubmit = (e) => { e.preventDefault(); handleSearch(); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes hpSpin { to { transform: rotate(360deg); } }
        .hp-search-input:focus { outline: none; border-color: ${T.teal400} !important; box-shadow: 0 0 0 3px ${T.teal50}; }
        .hp-popular-tag { transition: all .15s ease; cursor: pointer; user-select: none; }
        .hp-popular-tag:hover { transform: translateY(-1px); background: ${T.teal50} !important; border-color: ${T.teal400} !important; color: ${T.teal800} !important; }
        .hp-search-btn { transition: all .2s ease; }
        .hp-search-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(15,110,86,.22); }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#F8F7F3', fontFamily: "'DM Sans', sans-serif", paddingBottom: 64 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>

          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.teal600, marginBottom: 10 }}>Medicine Directory</div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 300, letterSpacing: '-1.5px', lineHeight: 1.1, color: '#1A1A18', marginBottom: 10 }}>
              Find your <em style={{ fontStyle: 'italic', color: T.teal600 }}>medicine.</em>
            </h1>
            <p style={{ fontSize: 15, color: '#6B6B68', fontWeight: 300, margin: 0 }}>
              Search any medicine to learn about uses, dosage, and precautions.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
            style={{ background: '#fff', border: `0.5px solid ${T.gray100}`, borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  className="hp-search-input"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search medicine name (e.g., Aspirin)..."
                  style={{ flex: 1, border: `0.5px solid #C4C3BA`, borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1A1A18', background: '#fff', transition: 'border-color .15s, box-shadow .15s' }}
                />
                <button type="submit" disabled={loading} className="hp-search-btn"
                  style={{ background: T.teal600, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {loading
                    ? <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'hpSpin .7s linear infinite' }} />
                    : '🔍'} Search
                </button>
              </div>
            </form>

            {/* Popular tags — always visible */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: T.gray400, marginBottom: 10 }}>Popular searches</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {POPULAR.map(name => (
                  <div key={name} className="hp-popular-tag"
                    onClick={() => handlePopular(name)}
                    style={{ background: '#fff', border: `0.5px solid #C4C3BA`, borderRadius: 20, padding: '6px 14px', fontSize: 13, color: '#4A4A47', fontWeight: 400 }}>
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {hasSearched && (
              <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                {loading ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : medicines.length > 0 ? (
                  <>
                    <div style={{ fontSize: 12.5, color: T.gray400, marginBottom: 16 }}>
                      Found <strong style={{ color: '#4A4A47' }}>{medicines.length}</strong> medicine{medicines.length !== 1 ? 's' : ''}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                      {medicines.map((med, i) => (
                        <MedicineCard
                          key={med.id}
                          medicine={med}
                          delay={i * 60}
                          onViewDetails={() => navigate(`/medicines/${med.id}`)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ background: '#fff', border: `0.5px solid ${T.gray100}`, borderRadius: 16, padding: '56px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: 36, marginBottom: 14 }}>🔍</div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 300, color: '#1A1A18', marginBottom: 8 }}>No medicines found</div>
                    <div style={{ fontSize: 14, color: '#6B6B68' }}>Try a different name or check the spelling.</div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Empty state before search */}
            {!hasSearched && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '56px 24px' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>💊</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 300, color: '#1A1A18', marginBottom: 8 }}>Search to get started</div>
                <div style={{ fontSize: 14, color: '#6B6B68' }}>Enter a medicine name above or pick a popular one.</div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
};

export default Medicines;