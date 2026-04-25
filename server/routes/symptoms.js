const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
const { symptomsLimiter } = require('../middleware/rateLimiter');
const User = require('../models/User');

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// POST /api/symptoms
router.post('/', authMiddleware, symptomsLimiter, async (req, res) => {
  try {
    const { symptoms } = req.body;

    // ✅ Validation
    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim() === '') {
      return res.status(400).json({ error: 'Symptoms are required' });
    }

    // ✅ Fix Mongoose Warning (Reverting to your working returnDocument syntax)
    await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { symptomCheckCount: 1 } },
      { returnDocument: 'after' } 
    );

    // ✅ Prompt with strict JSON instruction
    const systemPrompt = `
      You are a cautious medical assistant. Suggest 2-3 COMMON and NON-SERIOUS conditions for: "${symptoms}".
      Return ONLY valid JSON.
      Format: {"illnesses": [{"name": "string", "description": "string", "precautions": ["list"], "suggestedMedicine": "string"}]}
    `;

    // ✅ Updated API Endpoint for 2026 (v1beta with gemini-3-flash-preview)
    // This model is specifically available for the Free Tier shown in your screenshot.
    const aiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
            responseMimeType: "application/json" // Native JSON mode support
        }
      }
    );

    const candidate = aiResponse.data.candidates?.[0];
    
    if (!candidate || candidate.finishReason === "SAFETY") {
      return res.status(422).json({ 
        error: "Safety Block: These symptoms may be serious. Please consult a doctor immediately." 
      });
    }

    const responseText = candidate.content.parts[0].text.trim();
    const parsed = JSON.parse(responseText);

    // ✅ Basic safety filter
    const blocked = ["cancer", "tumor", "stroke", "heart attack", "death"];
    const safeIllnesses = (parsed.illnesses || []).filter(item => {
      const text = (item.name + " " + item.description).toLowerCase();
      return !blocked.some(word => text.includes(word));
    });

    res.json({
      illnesses: safeIllnesses,
      disclaimer: 'This is an AI suggestion, not a diagnosis. Consult a professional.',
    });

  } catch (error) {
    console.error('❌ Error details:', error.response?.data || error.message);
    
    // Fallback: If gemini-3 is not yet active on your key, try gemini-2.5-flash
    res.status(500).json({ 
        error: 'Analysis failed', 
        details: error.response?.data?.error?.message || "Model not found. Ensure your API key is active."
    });
  }
});

module.exports = router;