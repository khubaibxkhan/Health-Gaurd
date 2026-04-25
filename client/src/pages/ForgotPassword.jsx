 import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const T = {
  teal50: "#E1F5EE", teal400: "#1D9E75", teal600: "#0F6E56", teal800: "#085041",
  gray50: "#F1EFE8", gray100: "#D3D1C7", gray400: "#888780",
};

const ForgotPassword = () => {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Email is required'); return; }
    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ minHeight: "100vh", background: T.gray50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div style={{ background: "#fff", border: `0.5px solid ${T.gray100}`, borderRadius: 16, padding: "36px 28px", width: "100%", maxWidth: 420 }}>

        {/* Brand */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28, gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, background: T.teal400, borderRadius: "50%", animation: "hg-pulse 2.5s infinite" }} />
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, letterSpacing: "-.3px", color: "#1A1A18" }}>
              Health Guard
            </span>
          </div>
          <div style={{ fontSize: 12, color: T.gray400 }}>
            {submitted ? "Check your inbox" : "Reset your password"}
          </div>
          <style>{`@keyframes hg-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}`}</style>
        </div>

        {submitted ? (
          /* ── Success state ── */
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ background: T.teal50, border: `0.5px solid ${T.teal400}`, borderRadius: 12, padding: "20px 16px", textAlign: "center", marginBottom: 16 }}>
              {/* Checkmark circle */}
              <div style={{ width: 40, height: 40, background: T.teal400, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <div style={{ width: 14, height: 8, borderBottom: "2.5px solid #fff", borderRight: "2.5px solid #fff", transform: "rotate(45deg) translate(-1px,-2px)" }} />
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 400, color: T.teal800, marginBottom: 8 }}>
                Reset link sent
              </div>
              <div style={{ fontSize: 13, color: T.teal600, lineHeight: 1.6 }}>
                We've sent a reset link to{" "}
                <strong style={{ color: T.teal800, fontWeight: 500 }}>{email}</strong>.
                Check your inbox and spam folder.
              </div>
            </div>
            <p style={{ fontSize: 12, color: T.gray400, textAlign: "center", marginBottom: 0 }}>
              The link expires in 15 minutes.
            </p>
          </motion.div>
        ) : (
          /* ── Form state ── */
          <>
            <p style={{ fontSize: 13, color: "#6B6B68", textAlign: "center", lineHeight: 1.65, marginBottom: 24 }}>
              Enter the email address linked to your account and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 4 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#6B6B68", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  style={{ width: "100%", border: `0.5px solid ${T.gray100}`, borderRadius: 8, padding: "10px 12px", fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: "#1A1A18", background: "#fff", outline: "none" }}
                />
              </div>
              <button
                type="submit" disabled={loading}
                style={{ width: "100%", background: loading ? T.gray100 : T.teal600, color: loading ? T.gray400 : "#fff", border: "none", padding: "12px", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", marginTop: 16, opacity: loading ? .7 : 1 }}
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          </>
        )}

        <Link to="/login" style={{ display: "block", textAlign: "center", marginTop: 20, fontSize: 13, color: T.teal600, fontWeight: 500, textDecoration: "none" }}>
          ← Back to sign in
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;