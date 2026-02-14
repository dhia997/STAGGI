const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const generateToken = require('../config/generateToken');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────
// POST /api/students/signup
// ─────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { fullName, email, university, fieldOfStudy, password, confirmPassword } = req.body;

  // Validate required fields
  if (!fullName || !email || !university || !fieldOfStudy || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new student (password is hashed via pre-save hook)
    const student = await Student.create({
      fullName,
      email,
      university,
      fieldOfStudy,
      password
    });

    // Generate JWT token
    const token = generateToken(student._id, student.role);

    res.status(201).json({
      message: 'Student account created successfully',
      token,
      user: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        university: student.university,
        fieldOfStudy: student.fieldOfStudy,
        role: student.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// POST /api/students/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await student.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(student._id, student.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        university: student.university,
        fieldOfStudy: student.fieldOfStudy,
        role: student.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// GET /api/students/profile  (protected)
// ─────────────────────────────────────────
router.get('/profile', protect, authorizeRole('student'), async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;