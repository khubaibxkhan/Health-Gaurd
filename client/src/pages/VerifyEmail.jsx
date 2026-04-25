import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const T = {
  teal50:"#E1F5EE", teal400:"#1D9E75", teal600:"#0F6E56", teal800:"#085041",
  gray50:"#F1EFE8", gray100:"#D3D1C7", gray400:"#888780",
};

const VerifyEmail = () => {
  const { login }  = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate   = useNavigate();
  const email      = searchParams.get('email');

  const [otp, setOtp]           = useState(['','','','','','']);
  const [loading, setLoading]   = useState(false);
  const [canResend, setCanResend]   = useState(false);
  const [countdown, setCountdown]   = useState(60);

  useEffect(() => {
    if (!email) { toast.error('Email not provided'); navigate('/register'); }
  }, [email, navigate]);

  useEffect(() => {
    if (canResend || countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, canResend]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { toast.error('Please enter all 6 digits'); return; }
    try {
      setLoading(true);
      const res = await api.post('/auth/verify-email', { email, otp: code });
      login(res.data.token, res.data.user);
      toast.success('Email verified!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed');
    } finally { setLoading(false); }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      await api.post('/auth/resend-otp', { email });
      setCanResend(false);
      setCountdown(60);
      toast.success('New OTP sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP');
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
          <div style={{ fontSize:12, color:"#888780" }}>Verify your email</div>
          <style>{`@keyframes hg-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}`}</style>
        </div>

        <p style={{ textAlign:"center", fontSize:13, color:"#6B6B68", lineHeight:1.6, marginBottom:24 }}>
          A 6-digit code was sent to{' '}
          <strong style={{ color:"#1A1A18", fontWeight:500 }}>{email}</strong>.
          Enter it below to continue.
        </p>

        <form onSubmit={handleVerify}>
          {/* OTP boxes */}
          <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:24 }}>
            {otp.map((digit, i) => (
              <input
                key={i} id={`otp-${i}`}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{
                  width:44, height:48, textAlign:"center",
                  fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:400,
                  border:`0.5px solid ${digit ? T.teal400 : T.gray100}`,
                  borderRadius:8, outline:"none",
                  background: digit ? T.teal50 : "#fff",
                  color: digit ? T.teal800 : "#1A1A18",
                  transition:"all .15s",
                }}
              />
            ))}
          </div>

          <button type="submit" disabled={loading}
            style={{ width:"100%", background: loading ? T.gray100 : T.teal600, color: loading ? "#888780" : "#fff", border:"none", padding:"12px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:13.5, fontWeight:500, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? 'Verifying…' : 'Verify code'}
          </button>
        </form>

        <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:T.gray400 }}>
          {canResend ? (
            <button onClick={handleResendOTP} disabled={loading}
              style={{ background:"none", border:"none", color:T.teal600, fontWeight:500, fontSize:13, cursor:"pointer" }}>
              Resend code
            </button>
          ) : (
            `Resend code in ${countdown}s`
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyEmail;