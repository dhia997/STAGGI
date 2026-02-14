const express = require('express');
const router = express.Router();
const Recruiter = require('../models/Recruiter');
const generateToken = require('../config/generateToken');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────
// POST /api/recruiters/signup
// ─────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { companyName, email, position, companyWebsite, password, confirmPassword } = req.body;

  // Validate required fields
  if (!companyName || !email || !position || !companyWebsite || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if email already exists
    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new recruiter (password is hashed via pre-save hook)
    const recruiter = await Recruiter.create({
      companyName,
      email,
      position,
      companyWebsite,
      password
    });

    // Generate JWT token
    const token = generateToken(recruiter._id, recruiter.role);

    res.status(201).json({
      message: 'Recruiter account created successfully',
      token,
      user: {
        id: recruiter._id,
        companyName: recruiter.companyName,
        email: recruiter.email,
        position: recruiter.position,
        companyWebsite: recruiter.companyWebsite,
        role: recruiter.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// POST /api/recruiters/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find recruiter by email
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await recruiter.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(recruiter._id, recruiter.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: recruiter._id,
        companyName: recruiter.companyName,
        email: recruiter.email,
        position: recruiter.position,
        companyWebsite: recruiter.companyWebsite,
        role: recruiter.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// GET /api/recruiters/profile  (protected)
// ─────────────────────────────────────────
router.get('/profile', protect, authorizeRole('recruiter'), async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;