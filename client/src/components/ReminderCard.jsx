import React from 'react';
import { motion } from 'framer-motion';

const T = {
  teal50: "#E1F5EE", teal400: "#1D9E75", teal600: "#0F6E56", teal800: "#085041",
  gray50: "#F1EFE8", gray100: "#D3D1C7", gray400: "#888780", gray800: "#444441",
  red50: "#FCEBEB", red200: "#F09595", red800: "#A32D2D",
};

/* Splits a "13:15" time string into { display: "1:15", period: "PM" } */
const formatTime = (raw = "") => {
  const [hStr, mStr] = raw.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr?.slice(0, 2) ?? "00";
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return { display: `${h}:${m}`, period };
};

const ReminderCard = ({ reminder, onEdit, onDelete }) => {
  const { display, period } = formatTime(reminder.time);

  /* Determine if this reminder is "active now" for the teal highlight */
  const now = new Date();
  const [rH, rM] = reminder.time.split(":").map(Number);
  const diffMins = Math.abs((rH * 60 + rM) - (now.getHours() * 60 + now.getMinutes()));
  const isNow = diffMins <= 10;

  const freqLabel =
    reminder.frequency === "custom" && reminder.days?.length
      ? reminder.days.join(", ")
      : reminder.frequency;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      style={{
        background: "#fff",
        border: `0.5px solid ${isNow ? T.teal400 : T.gray100}`,
        borderRadius: 12,
        padding: "16px 20px",
        marginBottom: 10,
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
      }}
    >
      {/* Time column */}
      <div style={{
        background: isNow ? T.teal50 : T.gray50,
        borderRadius: 10,
        padding: "8px 12px",
        textAlign: "center",
        minWidth: 64,
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 18, fontWeight: 400,
          color: isNow ? T.teal800 : "#1A1A18",
          lineHeight: 1.1,
        }}>
          {display}
        </div>
        <span style={{ fontSize: 10, color: T.gray400, letterSpacing: ".3px", display: "block", marginTop: 2 }}>
          {period}
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: "#1A1A18" }}>
            {reminder.medicineName}
          </div>
          <span style={{
            fontSize: 11, fontWeight: 500,
            padding: "3px 10px", borderRadius: 20,
            background: isNow ? T.teal50 : T.gray50,
            color: isNow ? T.teal800 : T.gray800,
            textTransform: "capitalize", flexShrink: 0,
          }}>
            {freqLabel}
          </span>
        </div>

        <div style={{ fontSize: 12.5, color: "#6B6B68", marginBottom: 4 }}>
          {reminder.dosage}
        </div>

        {reminder.notes && (
          <div style={{
            fontSize: 12.5, color: "#6B6B68", fontStyle: "italic",
            borderLeft: `2px solid ${T.gray100}`, paddingLeft: 10,
            margin: "8px 0", lineHeight: 1.55,
          }}>
            {reminder.notes}
          </div>
        )}

        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          <button
            onClick={onEdit}
            style={{
              flex: 1, background: "transparent",
              border: `0.5px solid ${T.gray100}`, color: T.gray800,
              padding: "8px 12px", borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 500,
              cursor: "pointer", transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.gray50}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            style={{
              flex: 1, background: "transparent",
              border: `0.5px solid ${T.red200}`, color: T.red800,
              padding: "8px 12px", borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 500,
              cursor: "pointer", transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.red50}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReminderCard;