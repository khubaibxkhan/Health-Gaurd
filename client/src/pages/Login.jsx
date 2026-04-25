import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const T = {
  teal50:"#E1F5EE", teal400:"#1D9E75", teal600:"#0F6E56", teal800:"#085041",
  gray50:"#F1EFE8", gray100:"#D3D1C7", gray400:"#888780",
  red50:"#FCEBEB", red200:"#F09595", red800:"#A32D2D",
};

const fieldStyle = (hasErr) => ({
  width:"100%", border:`0.5px solid ${hasErr ? T.red200 : T.gray100}`,
  borderRadius:8, padding:"10px 12px",
  fontFamily:"'DM Sans',sans-serif", fontSize:13.5,
  color:"#1A1A18", background:"#fff", outline:"none",
  transition:"border-color .15s",
});
const labelStyle = {
  display:"block", fontSize:11, fontWeight:500, color:"#6B6B68",
  textTransform:"uppercase", letterSpacing:".8px", marginBottom:6,
};

const Brand = ({ sub }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:32, gap:10 }}>
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ width:10, height:10, background:T.teal400, borderRadius:"50%", animation:"hg-pulse 2.5s infinite" }} />
      <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, letterSpacing:"-.3px", color:"#1A1A18" }}>
        Health Guard
      </span>
    </div>
    <div style={{ fontSize:12, color:T.gray400, letterSpacing:".2px" }}>{sub}</div>
    <style>{`@keyframes hg-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}`}</style>
  </div>
);

const FieldError = ({ msg }) => msg
  ? <p style={{ fontSize:11.5, color:T.red800, marginTop:4 }}>{msg}</p>
  : null;

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email:'', password:'' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [showResendOTP, setShowResendOTP] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]:value }));
    setErrors(p => ({ ...p, [name]:'' }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.email)    e.email    = 'Email is required';
    if (!formData.password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      await api.post('/auth/resend-otp', { email: formData.email });
      toast.success('OTP sent to your email');
      navigate(`/verify-email?email=${formData.email}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await api.post('/auth/login', formData);
      login(res.data.token, res.data.user);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error;
      if (err.response?.status === 403) { setShowResendOTP(true); toast.error(msg || 'Please verify your email'); }
      else toast.error(msg || 'Login failed');
    } finally { setLoading(false); }
  };

  const btnStyle = (bg = T.teal600) => ({
    width:"100%", background: loading ? T.gray100 : bg,
    color: loading ? T.gray400 : "#fff", border:"none",
    padding:"12px", borderRadius:8,
    fontFamily:"'DM Sans',sans-serif", fontSize:13.5, fontWeight:500,
    cursor: loading ? "not-allowed" : "pointer", marginTop:4,
    opacity: loading ? .7 : 1, transition:"opacity .15s",
  });

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      style={{ minHeight:"100vh", background:T.gray50, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#fff", border:`0.5px solid ${T.gray100}`, borderRadius:16, padding:"36px 28px", width:"100%", maxWidth:420 }}>
        <Brand sub="Your intelligent health companion" />

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="you@email.com" style={fieldStyle(!!errors.email)} />
            <FieldError msg={errors.email} />
          </div>

          <div style={{ marginBottom:20 }}>
            <label style={labelStyle}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              placeholder="••••••" style={fieldStyle(!!errors.password)} />
            <FieldError msg={errors.password} />
          </div>

          {showResendOTP && (
            <button type="button" onClick={handleResendOTP} disabled={loading} style={{ ...btnStyle("#378ADD"), marginBottom:8 }}>
              Resend OTP
            </button>
          )}

          <button type="submit" disabled={loading} style={btnStyle()}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ height:"0.5px", background:T.gray100, margin:"20px 0" }} />

        <div style={{ textAlign:"center", fontSize:13, color:"#6B6B68" }}>
          <Link to="/forgot-password" style={{ color:T.teal600, fontWeight:500, textDecoration:"none", display:"block", marginBottom:10 }}>
            Forgot password?
          </Link>
          No account?{' '}
          <Link to="/register" style={{ color:T.teal600, fontWeight:500, textDecoration:"none" }}>Register</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;