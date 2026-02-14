const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');

const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request based on role
      if (decoded.role === 'student') {
        req.user = await Student.findById(decoded.id).select('-password');
      } else if (decoded.role === 'recruiter') {
        req.user = await Recruiter.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }
};

// Middleware to restrict access by role
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Only ${roles.join(', ')} can access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRole };