import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const T = {
  teal50: '#E1F5EE', teal100: '#9FE1CB', teal400: '#1D9E75',
  teal600: '#0F6E56', teal800: '#085041',
  blue50: '#E6F1FB', blue400: '#378ADD', blue800: '#0C447C',
  gray50: '#F1EFE8', gray100: '#D3D1C7', gray400: '#888780',
  red50: '#FCEBEB', red400: '#E24B4A', red800: '#A32D2D',
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.teal600, marginBottom: 10 }}>{children}</div>
);

const inputStyle = {
  width: '100%', border: `0.5px solid #C4C3BA`, borderRadius: 10,
  padding: '11px 14px', fontFamily: "'DM Sans', sans-serif",
  fontSize: 14, color: '#1A1A18', background: '#fff',
  transition: 'border-color .15s, box-shadow .15s', boxSizing: 'border-box',
};

const FormCard = ({ label, children, onSubmit, btnLabel, btnColor = T.teal600, delay = 0 }) => (
  <motion.div variants={fadeUp} initial="hidden" animate="show" custom={delay}
    style={{ background: '#fff', border: `0.5px solid ${T.gray100}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16 }}>
    <SectionLabel>{label}</SectionLabel>
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {children}
      <button type="submit"
        style={{ background: btnColor, color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4, transition: 'opacity .15s' }}>
        {btnLabel}
      </button>
    </form>
  </motion.div>
);

const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [profileForm, setProfileForm] = useState({ name: '', bio: '' });
  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', bio: user.bio || '' });
      setSavedMedicines(user.savedMedicines || []);
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try { setLoading(true); const r = await api.put('/profile/update', profileForm); updateUser(r.data); toast.success('Profile updated!'); }
    catch (err) { toast.error(err.response?.data?.error || 'Update failed'); }
    finally { setLoading(false); }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    try { setLoading(true); await api.put('/profile/change-email', emailForm); toast.success('OTP sent to new email'); setEmailForm({ newEmail: '', password: '' }); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    try { setLoading(true); await api.put('/profile/change-password', passwordForm); toast.success('Password changed!'); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append('avatar', file);
    try { setLoading(true); const r = await api.post('/profile/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); updateUser({ avatar: r.data.avatar }); toast.success('Avatar updated!'); }
    catch (err) { toast.error(err.response?.data?.error || 'Upload failed'); }
    finally { setLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') { toast.error('Type DELETE to confirm'); return; }
    try { setLoading(true); await api.delete('/profile/delete-account', { data: { confirmText: 'DELETE' } }); toast.success('Account deleted'); logout(); navigate('/login'); }
    catch (err) { toast.error(err.response?.data?.error || 'Deletion failed'); }
    finally { setLoading(false); }
  };

  const handleRemoveMedicine = async (medicineId) => {
    try { await api.delete(`/medicines/save/${medicineId}`); setSavedMedicines(prev => prev.filter(m => m.id !== medicineId)); toast.success('Removed'); }
    catch { toast.error('Failed to remove'); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
        .hp-input:focus { outline: none; border-color: ${T.teal400} !important; box-shadow: 0 0 0 3px ${T.teal50}; }
        .hp-med-row { transition: background .15s; }
        .hp-med-row:hover { background: ${T.gray50} !important; }
        .hp-avatar-btn { transition: all .15s; }
        .hp-avatar-btn:hover { opacity: .85; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#F8F7F3', fontFamily: "'DM Sans', sans-serif", paddingBottom: 64 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>

          {/* Page header */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} style={{ marginBottom: 32 }}>
            <SectionLabel>Account</SectionLabel>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 300, letterSpacing: '-1.5px', color: '#1A1A18', marginBottom: 6 }}>
              Your <em style={{ fontStyle: 'italic', color: T.teal600 }}>profile.</em>
            </h1>
            <p style={{ fontSize: 15, color: '#6B6B68', fontWeight: 300, margin: 0 }}>Manage your account details and preferences.</p>
          </motion.div>

          {/* Avatar / identity card */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
            style={{ background: '#fff', border: `0.5px solid ${T.gray100}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {user?.avatar
                  ? <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${T.teal100}` }} />
                  : <div style={{ width: 72, height: 72, borderRadius: '50%', background: T.teal50, border: `2px solid ${T.teal100}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 600, color: T.teal800 }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: '#1A1A18', marginBottom: 3 }}>{user?.name}</div>
                <div style={{ fontSize: 13, color: '#6B6B68', marginBottom: 6 }}>{user?.email}</div>
                <div style={{ fontSize: 11.5, color: T.gray400 }}>
                  Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : 'N/A'}
                </div>
              </div>

              {/* Verified badge */}
              <div style={{ background: user?.isVerified ? T.teal50 : '#FEF3C7', color: user?.isVerified ? T.teal800 : '#92400E', border: `0.5px solid ${user?.isVerified ? T.teal400 : '#F59E0B'}`, borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 500, flexShrink: 0 }}>
                {user?.isVerified ? '✓ Verified' : '⚠ Unverified'}
              </div>
            </div>

            {/* Change avatar */}
            <label className="hp-avatar-btn" style={{ display: 'inline-block', marginTop: 18, background: T.teal600, color: '#fff', borderRadius: 9, padding: '9px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Change Avatar
              <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={loading} style={{ display: 'none' }} />
            </label>
          </motion.div>

          {/* Edit Profile */}
          <FormCard label="Edit Profile" onSubmit={handleProfileUpdate} btnLabel="Save Changes" delay={2}>
            <div>
              <div style={{ fontSize: 12, color: T.gray400, marginBottom: 6 }}>Full name</div>
              <input className="hp-input" style={inputStyle} type="text" value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Your name" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: T.gray400, marginBottom: 6 }}>Bio</div>
              <textarea className="hp-input" value={profileForm.bio}
                onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows={3} placeholder="Tell us about yourself..."
                style={{ ...inputStyle, resize: 'none' }} />
            </div>
          </FormCard>

          {/* Change Email */}
          <FormCard label="Change Email" onSubmit={handleChangeEmail} btnLabel="Send Verification Email" btnColor={T.blue400} delay={3}>
            <div>
              <div style={{ fontSize: 12, color: T.gray400, marginBottom: 6 }}>New email address</div>
              <input className="hp-input" style={inputStyle} type="email" value={emailForm.newEmail}
                onChange={e => setEmailForm({ ...emailForm, newEmail: e.target.value })} placeholder="new@email.com" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: T.gray400, marginBottom: 6 }}>Current password</div>
              <input className="hp-input" style={inputStyle} type="password" value={emailForm.password}
                onChange={e => setEmailForm({ ...emailForm, password: e.target.value })} placeholder="••••••" />
            </div>
          </FormCard>

          {/* Change Password */}
          <FormCard label="Change Password" onSubmit={handleChangePassword} btnLabel="Update Password" btnColor={T.blue400} delay={4}>
            {[
              { label: 'Current password', key: 'currentPassword' },
              { label: 'New password', key: 'newPassword' },
              { label: 'Confirm new password', key: 'confirmPassword' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 12, color: T.gray400, marginBottom: 6 }}>{f.label}</div>
                <input className="hp-input" style={inputStyle} type="password" value={passwordForm[f.key]}
                  onChange={e => setPasswordForm({ ...passwordForm, [f.key]: e.target.value })} placeholder="••••••" />
              </div>
            ))}
          </FormCard>

          {/* Saved Medicines */}
          {savedMedicines.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
              style={{ background: '#fff', border: `0.5px solid ${T.gray100}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16 }}>
              <SectionLabel>Saved Medicines</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {savedMedicines.map((med, i) => (
                  <div key={med.id} className="hp-med-row"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: i === 0 ? 'none' : `0.5px solid ${T.gray50}`, gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 }}
                      onClick={() => navigate(`/medicines/${med.id}`)}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: T.teal50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>💊</div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A18' }}>{med.name}</span>
                    </div>
                    <button onClick={() => handleRemoveMedicine(med.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: T.red400, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, flexShrink: 0 }}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Danger Zone */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
            style={{ background: T.red50, border: `0.5px solid ${T.red400}`, borderRadius: 16, padding: '24px 28px' }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.red400, marginBottom: 10 }}>Danger Zone</div>
            <p style={{ fontSize: 13.5, color: T.red800, marginBottom: 16, lineHeight: 1.6 }}>Deleting your account is permanent. All data will be erased and cannot be recovered.</p>
            <button onClick={() => setShowDeleteModal(true)}
              style={{ background: T.red400, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              Delete Account
            </button>
          </motion.div>

          {/* Delete Modal */}
          <AnimatePresence>
            {showDeleteModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 200 }}>
                <motion.div initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .95, opacity: 0 }}
                  style={{ background: '#fff', borderRadius: 16, padding: '28px', maxWidth: 420, width: '100%', border: `0.5px solid ${T.gray100}` }}>
                  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.red400, marginBottom: 12 }}>Confirm Deletion</div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 400, color: '#1A1A18', marginBottom: 10 }}>Delete your account?</h3>
                  <p style={{ fontSize: 13.5, color: '#6B6B68', lineHeight: 1.65, marginBottom: 18 }}>This action cannot be undone. All your reminders, saved medicines, and data will be permanently removed.</p>
                  <div style={{ fontSize: 12, color: T.gray400, marginBottom: 8 }}>Type <strong>DELETE</strong> to confirm</div>
                  <input className="hp-input" style={{ ...inputStyle, marginBottom: 16, border: `0.5px solid ${T.red400}` }}
                    value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setShowDeleteModal(false)}
                      style={{ flex: 1, background: T.gray50, color: '#4A4A47', border: `0.5px solid ${T.gray100}`, borderRadius: 10, padding: '11px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: 'pointer' }}>
                      Cancel
                    </button>
                    <button onClick={handleDeleteAccount} disabled={loading}
                      style={{ flex: 1, background: T.red400, color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: loading ? .7 : 1 }}>
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
};

export default Profile;