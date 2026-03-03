const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ── Connect to MongoDB ──────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.log('MongoDB error ❌', err));

// ── Routes ──────────────────────────────────────────────
app.use('/api/students', require('./routes/studentAuth'));
app.use('/api/recruiters', require('./routes/recruiterAuth'));
app.use('/api/cv', require('./routes/cvRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
// ── Health check ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'STAGII API is running 🚀' });
});

// ── 404 handler — doit être EN DERNIER ─────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error('🔴 Global Error:', err);
  res.status(err.status || 500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ── Start server ────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});