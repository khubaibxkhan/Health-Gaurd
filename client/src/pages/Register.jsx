import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const T = {
  teal50:"#E1F5EE", teal400:"#1D9E75", teal600:"#0F6E56", teal800:"#085041",
  gray50:"#F1EFE8", gray100:"#D3D1C7", gray400:"#888780",
  red200:"#F09595", red800:"#A32D2D",
  amber400:"#BA7517", green400:"#639922",
};

const fieldStyle = (hasErr) => ({
  width:"100%", border:`0.5px solid ${hasErr ? "#F09595" : "#D3D1C7"}`,
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
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28, gap:10 }}>
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ width:10, height:10, background:T.teal400, borderRadius:"50%", animation:"hg-pulse 2.5s infinite" }} />
      <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, letterSpacing:"-.3px", color:"#1A1A18" }}>Health Guard</span>
    </div>
    <div style={{ fontSize:12, color:T.gray400 }}>{sub}</div>
    <style>{`@keyframes hg-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}`}</style>
  </div>
);

const strengthColor = (s) => s <= 1 ? "#E24B4A" : s <= 3 ? T.amber400 : T.green400;
const strengthLabel = (s) => s <= 1 ? "Weak" : s <= 3 ? "Fair" : "Strong";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name:'', email:'', password:'', confirmPassword:'' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [strength, setStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]:value }));
    setErrors(p => ({ ...p, [name]:'' }));
    if (name === 'password') {
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
    if (!formData.name) e.name = 'Name is required';
    if (!formData.email) e.email = 'Email is required';
    if (!formData.password) e.password = 'Password is required';
    if (formData.password.length < 6) e.password = 'At least 6 characters required';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      await api.post('/auth/register', { name:formData.name, email:formData.email, password:formData.password, confirmPassword:formData.confirmPassword });
      toast.success('OTP sent to your email!');
      navigate(`/verify-email?email=${formData.email}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      style={{ minHeight:"100vh", background:T.gray50, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#fff", border:`0.5px solid ${T.gray100}`, borderRadius:16, padding:"36px 28px", width:"100%", maxWidth:420 }}>
        <Brand sub="Create your account" />

        <form onSubmit={handleSubmit}>
          {[
            { label:"Full name",        name:"name",            type:"text",     placeholder:"Priya Sharma" },
            { label:"Email",            name:"email",           type:"email",    placeholder:"you@email.com" },
            { label:"Password",         name:"password",        type:"password", placeholder:"••••••" },
            { label:"Confirm password", name:"confirmPassword", type:"password", placeholder:"••••••" },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: f.name === 'confirmPassword' ? 0 : 14 }}>
              <label style={labelStyle}>{f.label}</label>
              <input type={f.type} name={f.name} value={formData[f.name]}
                onChange={handleChange} placeholder={f.placeholder}
                style={fieldStyle(!!errors[f.name])} />

              {/* Password strength bar */}
              {f.name === 'password' && formData.password && (
                <div style={{ marginTop:6 }}>
                  <div style={{ height:3, background:T.gray100, borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(strength/5)*100}%`, background:strengthColor(strength), borderRadius:2, transition:"width .3s, background .3s" }} />
                  </div>
                  <div style={{ fontSize:11, color:strengthColor(strength), marginTop:3, fontWeight:500 }}>
                    {strengthLabel(strength)}
                  </div>
                </div>
              )}

              {errors[f.name] && <p style={{ fontSize:11.5, color:T.red800, marginTop:4 }}>{errors[f.name]}</p>}
            </div>
          ))}

          <button type="submit" disabled={loading}
            style={{ width:"100%", background: loading ? T.gray100 : T.teal600, color: loading ? T.gray400 : "#fff", border:"none", padding:"12px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:13.5, fontWeight:500, cursor: loading ? "not-allowed" : "pointer", marginTop:20, opacity: loading ? .7 : 1 }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={{ textAlign:"center", fontSize:13, color:"#6B6B68", marginTop:16 }}>
          Already registered?{' '}
          <Link to="/login" style={{ color:T.teal600, fontWeight:500, textDecoration:"none" }}>Sign in</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;