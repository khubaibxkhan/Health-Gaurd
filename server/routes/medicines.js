const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Helper function to fetch from FDA API
const fetchFromFDA = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('FDA API error:', error);
    return null;
  }
};

// GET /api/medicines/search?q={query}
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (q.length > 100) {
      return res.status(400).json({ error: 'Search query too long' });
    }

    const encodedQuery = encodeURIComponent(q);
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodedQuery}"&limit=10`;

    const data = await fetchFromFDA(url);

    if (!data || !data.results) {
      return res.json({ medicines: [] });
    }

    const medicines = data.results.map((drug) => ({
      id: drug.id || '',
      brandName: (drug.openfda?.brand_name?.[0] || 'N/A').toUpperCase(),
      genericName: drug.openfda?.generic_name?.[0] || 'N/A',
      manufacturer: drug.openfda?.manufacturer_name?.[0] || 'N/A',
      purpose: (drug.purpose?.[0] || 'General health supplement').substring(0, 100),
    }));

    res.json({ medicines });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search medicines' });
  }
});

// GET /api/medicines/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const url = `https://api.fda.gov/drug/label.json?search=id:"${id}"&limit=1`;
    const data = await fetchFromFDA(url);

    if (!data || !data.results || data.results.length === 0) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    const drug = data.results[0];

    const medicine = {
      id: drug.id || '',
      brandName: (drug.openfda?.brand_name?.[0] || 'N/A').toUpperCase(),
      genericName: drug.openfda?.generic_name?.[0] || 'N/A',
      manufacturer: drug.openfda?.manufacturer_name?.[0] || 'N/A',
      indicationsAndUsage: drug.indications_and_usage?.[0] || 'See drug label',
      dosageAndAdministration: drug.dosage_and_administration?.[0] || 'See drug label',
      warnings: drug.warnings?.[0] || 'See drug label',
      adverseReactions: drug.adverse_reactions?.[0] || 'See drug label',
      contraindications: drug.contraindications?.[0] || 'See drug label',
      howSupplied: drug.how_supplied?.[0] || 'See drug label',
    };

    res.json(medicine);
  } catch (error) {
    console.error('Detail error:', error);
    res.status(500).json({ error: 'Failed to fetch medicine details' });
  }
});

// POST /api/medicines/save
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { name, id } = req.body;

    if (!name || !id) {
      return res.status(400).json({ error: 'Medicine name and id are required' });
    }

    const user = await User.findById(req.user._id);

    const alreadySaved = user.savedMedicines.some((med) => med.id === id);
    if (alreadySaved) {
      return res.status(400).json({ error: 'Medicine already saved' });
    }

    user.savedMedicines.push({ name, id });
    await user.save();

    res.json({ message: 'Medicine saved' });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to save medicine' });
  }
});

// DELETE /api/medicines/save/:id
router.delete('/save/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);
    user.savedMedicines = user.savedMedicines.filter((med) => med.id !== id);
    await user.save();

    res.json({ message: 'Medicine removed from saved' });
  } catch (error) {
    console.error('Remove error:', error);
    res.status(500).json({ error: 'Failed to remove medicine' });
  }
});

module.exports = router;
