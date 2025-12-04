// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const JWT_EXPIRES = '7d';

const signupSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const generateToken = (user) =>
  jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// POST /auth/signup
router.post('/signup', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: 'Validation Error', errors: error.details });
    }

    const { name, email, password } = value;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create & save user
    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('/auth/signup error:', err && err.stack ? err.stack : err);

    // Handle Mongo duplicate key error explicitly (safety)
    if (err && err.code === 11000) {
      // usually duplicate key on unique index, e.g. email
      return res.status(400).json({ success: false, message: 'Email already in use (duplicate)' });
    }

    // If validation error from mongoose, return details
    if (err && err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: 'Validation Error', errors });
    }

    // Generic server error (include message for debugging locally)
    return res.status(500).json({
      success: false,
      message: err && err.message ? err.message : 'Internal Server Error',
      // NOTE: Do not expose stack in production. This is for local debugging.
      stack: err && err.stack ? err.stack : undefined
    });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: 'Validation Error', errors: error.details });

    const { email, password } = value;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = generateToken(user);
    return res.json({ success: true, message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('/auth/login error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ success: false, message: err && err.message ? err.message : 'Internal Server Error' });
  }
});

// GET /auth/me (optional) — you can protect this route with middleware if you add it
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, user });
  } catch (err) {
    console.error('/auth/me error:', err && err.stack ? err.stack : err);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
