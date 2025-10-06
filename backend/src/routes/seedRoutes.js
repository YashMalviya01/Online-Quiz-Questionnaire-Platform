const express = require('express');
const router = express.Router();
const seedDatabase = require('../utils/seedData');

// POST /api/seed - Seed database with demo data
router.post('/', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in seed route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

module.exports = router;
