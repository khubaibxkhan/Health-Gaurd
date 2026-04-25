import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const T = {
  teal400:"#1D9E75", teal600:"#0F6E56",
  gray50:"#F1EFE8", gray100:"#D3D1C7", gray400:"#888780",
  red200:"#F09595", red800:"#A32D2D",
  amber400:"#BA7517", green400:"#639922",
};

const fieldStyle = (hasErr) => ({
  width:"100%", border:`0.5px solid ${hasErr ? T.red200 : T.gray100}`,
  borderRadius:8, padding:"10px 12px",
  fontFamily:"'DM Sans',sans-serif", fontSize:13.5,
  color:"#1A1A18", background:"#fff", outline:"none",
});
const labelStyle = {
  display:"block", fontSize:11, fontWeight:500, color:"#6B6B68",
  textTransform:"uppercase", letterSpacing:".8px", marginBottom:6,
};

const strengthColor = (s) => s <= 1 ? "#E24B4A" : s <= 3 ? T.amber400 : T.green400;
const strengthLabel = (s) => s <= 1 ? "Weak" : s <= 3 ? "Fair" : "Strong";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ newPassword:'', confirmPassword:'' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (!token) { toast.error('Invalid or missing reset token'); navigate('/login'); }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]:value }));
    setErrors(p => ({ ...p, [name]:'' }));
    if (name === 'newPassword') {
      let s = 0;
      if (value.length >= 6) s++;
      if (value.length >= 8) s++;
      if (/[A-Z]/.test(value)) s++;
      if (/[0-9]/.test(value)) s++;
      if (/[^A-Za-z0-9]/.test(value)) s++;
      setStrength(s);
    }
  };

  const validateForm = () => {
    const e = {};
    if (!formData.newPassword) e.newPassword = 'Password is required';
    if (formData.newPassword.length < 6) e.newPassword = 'At least 6 characters required';
    if (formData.newPassword !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !token) return;
    try {
      setLoading(true);
      await api.post('/auth/reset-password', { token, newPassword:formData.newPassword, confirmPassword:formData.confirmPassword });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password reset failed');
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      style={{ minHeight:"100vh", background:T.gray50, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#fff", border:`0.5px solid ${T.gray100}`, borderRadius:16, padding:"36px 28px", width:"100%", maxWidth:420 }}>

        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28, gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:10, height:10, background:T.teal400, borderRadius:"50%", animation:"hg-pulse 2.5s infinite" }} />
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, letterSpacing:"-.3px", color:"#1A1A18" }}>Health Guard</span>
          </div>
          <div style={{ fontSize:12, color:"#888780" }}>Create new password</div>
          <style>{`@keyframes hg-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}`}</style>
        </div>

        <p style={{ fontSize:13, color:"#6B6B68", textAlign:"center", lineHeight:1.6, marginBottom:24 }}>
          Choose a strong password — at least 6 characters with a mix of letters and numbers.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={labelStyle}>New password</label>
            <input type="password" name="newPassword" value={formData.newPassword}
              onChange={handleChange} placeholder="••••••" style={fieldStyle(!!errors.newPassword)} />
            {formData.newPassword && (
              <div style={{ marginTop:6 }}>
                <div style={{ height:3, background:T.gray100, borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(strength/5)*100}%`, background:strengthColor(strength), borderRadius:2, transition:"width .3s" }} />
                </div>
                <div style={{ fontSize:11, color:strengthColor(strength), marginTop:3, fontWeight:500 }}>{strengthLabel(strength)}</div>
              </div>
            )}
            {errors.newPassword && <p style={{ fontSize:11.5, color:T.red800, marginTop:4 }}>{errors.newPassword}</p>}
          </div>

          <div style={{ marginBottom:0 }}>
            <label style={labelStyle}>Confirm password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword}
              onChange={handleChange} placeholder="••••••" style={fieldStyle(!!errors.confirmPassword)} />
            {errors.confirmPassword && <p style={{ fontSize:11.5, color:T.red800, marginTop:4 }}>{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={loading}
            style={{ width:"100%", background: loading ? T.gray100 : T.teal600, color: loading ? "#888780" : "#fff", border:"none", padding:"12px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:13.5, fontWeight:500, cursor: loading ? "not-allowed" : "pointer", marginTop:20 }}>
            {loading ? 'Resetting…' : 'Set new password'}
          </button>
        </form>

        <div style={{ textAlign:"center", marginTop:16 }}>
          <Link to="/login" style={{ fontSize:13, color:T.teal600, fontWeight:500, textDecoration:"none" }}>Back to sign in</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ResetPassword;