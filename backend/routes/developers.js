// backend/routes/developers.js
const express = require('express');
const router = express.Router();
const Developer = require('../models/Developer');

// Helper to normalize arrays / strings
function toArray(value) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

// Basic server-side validation to provide friendly errors early
function validateDeveloperPayload({ name, role, techStack, experience }) {
  const errors = [];
  if (!name || String(name).trim().length < 2) errors.push('Name must be at least 2 characters.');
  if (!role || !['Frontend', 'Backend', 'Full-Stack'].includes(role)) errors.push('Role must be one of Frontend, Backend, Full-Stack.');
  const techs = toArray(techStack);
  if (!techs.length) errors.push('At least one tech is required in techStack.');
  const exp = Number(experience);
  if (isNaN(exp) || exp < 0) errors.push('Experience must be a non-negative number.');
  if (exp > 50) errors.push('Experience cannot exceed 50 years.');
  return { errors, techs, exp };
}

/**
 * GET /developers
 * List developers (search, filter, sort, pagination).
 * IMPORTANT: this must be defined BEFORE the param route (`/:id`)
 */
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      role = '',
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { techStack: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    if (role) {
      query.role = role;
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const skip = Math.max(0, parseInt(page || 1) - 1) * Math.max(0, parseInt(limit || 0));
    const limitNum = parseInt(limit) || 0;

    let q = Developer.find(query).sort(sortOptions);
    if (limitNum > 0) q = q.skip(skip).limit(limitNum);

    const developers = await q.exec();
    const total = await Developer.countDocuments(query);

    // Return simple object with meta so frontend can support pagination if needed
    res.json({
      success: true,
      count: developers.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / (limitNum || total || 1)),
      data: developers
    });
  } catch (err) {
    console.error('GET /developers error:', err && err.stack ? err.stack : err);
    res.status(500).json({
      message: 'Server Error (GET /developers)',
      error: err && err.message ? err.message : String(err),
      stack: err && err.stack ? err.stack : undefined
    });
  }
});

/**
 * GET /developers/:id
 * Return a single developer with helpful logs and error messages.
 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('GET /developers/:id called with id =', id);

    // quick sanity check
    if (!id || typeof id !== 'string' || id.length < 12) {
      console.warn('GET /developers/:id - invalid id format', id);
      return res.status(400).json({ message: 'Invalid developer id' });
    }

    const developer = await Developer.findById(id).exec();
    console.log('DB lookup result for id', id, '=', developer ? 'FOUND' : 'NOT FOUND');

    if (!developer) {
      return res.status(404).json({ message: 'Developer not found', id });
    }

    return res.json({ success: true, data: developer });
  } catch (err) {
    console.error('GET /developers/:id error:', err && err.stack ? err.stack : err);
    if (err && (err.name === 'CastError' || /Cast to ObjectId/.test(String(err.message)))) {
      return res.status(400).json({ message: 'Invalid developer id format', error: err.message });
    }
    return res.status(500).json({ message: 'Server Error (GET /developers/:id)', error: err && err.message ? err.message : String(err), stack: err && err.stack ? err.stack : undefined });
  }
});

/**
 * POST /developers
 * Create a new developer.
 */
router.post('/', async (req, res) => {
  try {
    const { name, role, techStack = [], experience = 0, description = '', photo = '' } = req.body;

    const { errors, techs, exp } = validateDeveloperPayload({ name, role, techStack, experience });
    if (errors.length) {
      return res.status(400).json({ message: 'Validation Error', errors });
    }

    const developer = new Developer({
      name: String(name).trim(),
      role,
      techStack: techs,
      experience: Number(exp),
      description: description ? String(description).trim() : '',
      photo: photo ? String(photo).trim() : ''
    });

    const savedDeveloper = await developer.save();
    return res.status(201).json(savedDeveloper);
  } catch (err) {
    console.error('POST /developers error:', err && err.stack ? err.stack : err);
    if (err && err.name === 'ValidationError') {
      const details = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation Error (mongoose)', errors: details });
    }
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key error', detail: err.keyValue || err.message });
    }
    return res.status(500).json({
      message: 'Server Error (POST /developers)',
      error: err && err.message ? err.message : String(err),
      stack: err && err.stack ? err.stack : undefined
    });
  }
});

/**
 * PUT /developers/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, role, techStack = [], experience = 0, description = '', photo = '' } = req.body;
    const { errors, techs, exp } = validateDeveloperPayload({ name, role, techStack, experience });
    if (errors.length) {
      return res.status(400).json({ message: 'Validation Error', errors });
    }

    const updateData = {
      name: String(name).trim(),
      role,
      techStack: techs,
      experience: Number(exp),
      description: description ? String(description).trim() : '',
      photo: photo ? String(photo).trim() : ''
    };

    const developer = await Developer.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!developer) return res.status(404).json({ message: 'Developer not found' });
    return res.json(developer);
  } catch (err) {
    console.error('PUT /developers/:id error:', err && err.stack ? err.stack : err);
    if (err && err.name === 'ValidationError') {
      const details = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation Error (mongoose)', errors: details });
    }
    return res.status(500).json({ message: 'Server Error (PUT /developers/:id)', error: err && err.message ? err.message : String(err), stack: err && err.stack ? err.stack : undefined });
  }
});

/**
 * DELETE /developers/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const developer = await Developer.findByIdAndDelete(req.params.id);
    if (!developer) return res.status(404).json({ message: 'Developer not found' });
    return res.json({ message: 'Developer deleted' });
  } catch (err) {
    console.error('DELETE /developers/:id error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Server Error (DELETE)', error: err && err.message ? err.message : String(err), stack: err && err.stack ? err.stack : undefined });
  }
});

module.exports = router;
