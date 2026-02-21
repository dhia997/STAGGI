const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Student = require('../models/Student');
const CV = require('../models/CV');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// POST /api/jobs — Créer un job
router.post('/', protect, authorizeRole('recruiter'), async (req, res) => {
  try {
    const { title, description, location, duration, requirements, skills, salary, type } = req.body;

    const skillsArray = skills
      ? skills.split(',').map(s => s.trim()).filter(s => s)
      : [];

    const job = await Job.create({
      recruiter: req.user._id,
      title, description, location,
      duration, requirements,
      skills: skillsArray,
      salary, type
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error: error.message });
  }
});

// GET /api/jobs/my — Jobs du recruteur connecté
router.get('/my', protect, authorizeRole('recruiter'), async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// GET /api/jobs — Tous les jobs actifs (pour les étudiants)
router.get('/', protect, async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' })
      .populate('recruiter', 'companyName fullName')
      .sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// DELETE /api/jobs/:id — Supprimer un job
router.delete('/:id', protect, authorizeRole('recruiter'), async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      recruiter: req.user._id
    });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job' });
  }
});

// PATCH /api/jobs/:id/status — Changer le statut active/closed
router.patch('/:id/status', protect, authorizeRole('recruiter'), async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user._id },
      { status: req.body.status },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job status' });
  }
});

// GET /api/jobs/candidates — Vrais étudiants avec leurs CVs
router.get('/candidates', protect, authorizeRole('recruiter'), async (req, res) => {
  try {
    // Récupérer tous les étudiants qui ont uploadé au moins un CV
    const cvs = await CV.find()
      .populate('student', 'fullName email university field')
      .sort({ score: -1 });

    // Grouper par étudiant — garder le meilleur score
    const studentsMap = {};
    cvs.forEach(cv => {
      if (!cv.student) return;
      const id = cv.student._id.toString();
      if (!studentsMap[id] || cv.score > studentsMap[id].score) {
        studentsMap[id] = {
          id,
          name: cv.student.fullName,
          email: cv.student.email,
          university: cv.student.university || 'Not specified',
          field: cv.student.field || 'Not specified',
          score: cv.score,
          skills: cv.skills || [],
          cvFilename: cv.filename
        };
      }
    });

    const candidates = Object.values(studentsMap);
    res.json({ success: true, candidates });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates' });
  }
});

module.exports = router;