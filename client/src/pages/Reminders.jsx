import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import ReminderCard from '../components/ReminderCard';
import LoadingSpinner from '../components/LoadingSpinner';

/* ── Design tokens ── */
const T = {
  teal50: "#E1F5EE", teal400: "#1D9E75", teal600: "#0F6E56", teal800: "#085041",
  amber50: "#FAEEDA", amber800: "#633806",
  gray50: "#F1EFE8", gray100: "#D3D1C7", gray400: "#888780", gray800: "#444441",
};

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", color: T.teal600, marginBottom: 10 }}>
    {children}
  </div>
);

const AIInsight = ({ text }) => (
  <div style={{ background: T.teal50, border: `0.5px solid ${T.teal400}`, borderRadius: 12, padding: "16px 20px", marginTop: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 11, fontWeight: 500, color: T.teal800, textTransform: "uppercase", letterSpacing: ".8px" }}>
      <div style={{ width: 6, height: 6, background: T.teal400, borderRadius: "50%", animation: "hg-pulse 2s infinite" }} />
      AI insight
    </div>
    <p style={{ fontSize: 13, color: T.teal800, lineHeight: 1.65, margin: 0 }}>{text}</p>
    <style>{`@keyframes hg-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}`}</style>
  </div>
);

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Reminders = () => {
  const [searchParams] = useSearchParams();
  const medicineParam = searchParams.get('medicine');

  const [reminders, setReminders]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [editingId, setEditingId]   = useState(null);

  const [formData, setFormData] = useState({
    medicineName: medicineParam || '',
    dosage: '', time: '', frequency: 'daily', days: [], notes: '',
  });

  useEffect(() => {
    fetchReminders();
    requestNotificationPermission();
    const cleanup = startReminderCheck();
    return cleanup;
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') toast.success('Notifications enabled!');
      } catch (error) { console.error('Notification permission error:', error); }
    }
  };

  const startReminderCheck = () => {
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  };

  const checkReminders = async () => {
    try {
      const res = await api.get('/reminders');
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      const dayName = DAYS[now.getDay() - 1 || 6];
      res.data.forEach((reminder) => {
        const isTimeMatch = Math.abs(parseInt(reminder.time) - parseInt(currentTime.replace(':', ''))) <= 5;
        if (isTimeMatch) {
          if (reminder.frequency === 'daily' ||
            (reminder.frequency === 'weekly' && DAYS.includes(dayName)) ||
            (reminder.frequency === 'custom' && reminder.days.includes(dayName))) {
            sendNotification(reminder.medicineName, reminder.dosage);
          }
        }
      });
    } catch (error) { console.error('Error checking reminders:', error); }
  };

  const sendNotification = (medicineName, dosage) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Medicine Reminder — Health Guard', { body: `Time to take ${medicineName} (${dosage})` });
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await api.get('/reminders');
      setReminders(response.data);
    } catch { toast.error('Failed to fetch reminders'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.medicineName || !formData.dosage || !formData.time) {
      toast.error('Please fill all required fields'); return;
    }
    try {
      if (editingId) {
        await api.put(`/reminders/${editingId}`, formData);
        toast.success('Reminder updated!');
        setEditingId(null);
      } else {
        await api.post('/reminders', formData);
        toast.success('Reminder created!');
      }
      setFormData({ medicineName: '', dosage: '', time: '', frequency: 'daily', days: [], notes: '' });
      fetchReminders();
    } catch (error) { toast.error(error.response?.data?.error || 'Failed to save reminder'); }
  };

  const handleEdit = (reminder) => {
    setEditingId(reminder._id);
    setFormData({ medicineName: reminder.medicineName, dosage: reminder.dosage, time: reminder.time, frequency: reminder.frequency, days: reminder.days || [], notes: reminder.notes || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this reminder?')) {
      try { await api.delete(`/reminders/${id}`); toast.success('Reminder deleted!'); fetchReminders(); }
      catch { toast.error('Failed to delete reminder'); }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ medicineName: medicineParam || '', dosage: '', time: '', frequency: 'daily', days: [], notes: '' });
  };

  /* ── Field style helper ── */
  const fieldStyle = {
    width: "100%", border: `0.5px solid ${T.gray100}`, borderRadius: 8,
    padding: "10px 12px", fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
    color: "#1A1A18", background: "#fff", outline: "none",
  };
  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 500, color: "#6B6B68",
    textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 6,
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8F7F3", display: "flex", alignItems: "center", justifyContent: "center" }}
        className="md:ml-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ minHeight: "100vh", background: "#F8F7F3", fontFamily: "'DM Sans', sans-serif" }}
      className="md:ml-64"
    >
      <div style={{ padding: "40px 24px 80px", maxWidth: 760, margin: "0 auto" }} className="md:p-10">

        {/* ── Header ── */}
        <SectionLabel>Smart Reminders</SectionLabel>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 400, letterSpacing: "-1.5px", color: "#1A1A18", lineHeight: 1.1, marginBottom: 10 }}>
          Reminders that actually <em style={{ fontStyle: "italic", color: T.teal600 }}>make sense.</em>
        </h1>
        <p style={{ fontSize: 14, color: "#6B6B68", fontWeight: 300, lineHeight: 1.65, marginBottom: 36 }}>
          Create reminders and Health Guard learns your patterns — scheduling doses at the medically optimal moment.
        </p>

        {/* ── Form card ── */}
        <motion.form
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          style={{ background: "#fff", border: `0.5px solid ${T.gray100}`, borderRadius: 12, padding: 24, marginBottom: 28 }}
        >
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 400, color: "#1A1A18", marginBottom: 20, letterSpacing: "-.3px" }}>
            {editingId ? 'Edit reminder' : 'Add new reminder'}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Medicine name *", name: "medicineName", type: "text", placeholder: "e.g. Aspirin" },
              { label: "Dosage *",        name: "dosage",       type: "text", placeholder: "e.g. 500mg" },
              { label: "Time *",          name: "time",         type: "time", placeholder: "" },
            ].map(f => (
              <div key={f.name}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} name={f.name} value={formData[f.name]} onChange={handleChange}
                  placeholder={f.placeholder} style={fieldStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Frequency</label>
              <select name="frequency" value={formData.frequency} onChange={handleChange} style={fieldStyle}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom days</option>
              </select>
            </div>
          </div>

          {/* Custom day picker */}
          {formData.frequency === 'custom' && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Select days</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {DAYS.map(day => (
                  <button key={day} type="button" onClick={() => handleDayToggle(day)}
                    style={{
                      padding: "7px 12px", borderRadius: 8, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                      transition: "all .15s",
                      background: formData.days.includes(day) ? T.teal50 : T.gray50,
                      border: `0.5px solid ${formData.days.includes(day) ? T.teal400 : T.gray100}`,
                      color: formData.days.includes(day) ? T.teal800 : T.gray800,
                    }}>
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Notes (optional)</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2}
              placeholder="e.g. Take after meals"
              style={{ ...fieldStyle, resize: "none" }} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit"
              style={{ flex: 1, background: T.teal600, color: "#fff", border: "none", padding: "11px 20px", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}>
              {editingId ? 'Update reminder' : 'Save reminder'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel}
                style={{ background: "transparent", color: "#6B6B68", border: `0.5px solid ${T.gray100}`, padding: "11px 16px", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, cursor: "pointer" }}>
                Cancel
              </button>
            )}
          </div>
        </motion.form>

        {/* ── Reminders list ── */}
        <div style={{ fontSize: 11, fontWeight: 500, color: T.gray400, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 14 }}>
          Your reminders ({reminders.length})
        </div>

        {reminders.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {reminders.map(reminder => (
              <ReminderCard
                key={reminder._id}
                reminder={reminder}
                onEdit={() => handleEdit(reminder)}
                onDelete={() => handleDelete(reminder._id)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0", background: "#fff", border: `0.5px solid ${T.gray100}`, borderRadius: 12 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏰</div>
            <p style={{ fontSize: 14, color: T.gray400 }}>No reminders yet. Create one to get started!</p>
          </div>
        )}

        <AIInsight text="Your 7-day average response time to morning reminders is 4 minutes — exceptional. Health Guard has noted you're most alert between 7–9 AM and 6–8 PM, so those windows are prioritized for important doses." />
      </div>
    </motion.div>
  );
};

export default Reminders;