const express = require('express');
const Developer = require('../models/Developer');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { role, tech } = req.query;
    const query = {};

    if (role) query.role = role;
    if (tech) query.techStack = { $regex: tech, $options: 'i' };

    const developers = await Developer.find(query).sort({ createdAt: -1 });
    res.json(developers);
  } catch (err) {
    console.error('Error fetching developers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { name, role, techStack, experience } = req.body;

    let techArray = techStack;
    if (typeof techStack === 'string') {
      techArray = techStack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const dev = new Developer({
      name,
      role,
      techStack: techArray,
      experience,
    });

    const saved = await dev.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating developer:', err);
    res.status(400).json({ message: err.message || 'Bad request' });
  }
});

module.exports = router;
