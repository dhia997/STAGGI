const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// POST /api/applications — Étudiant postule à un job
router.post('/', protect, authorizeRole('student'), async (req, res) => {
  try {
    const { jobId, cvScore, skills } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Vérifier si déjà postulé
    const existing = await Application.findOne({
      student: req.user._id,
      job: jobId
    });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const application = await Application.create({
      student: req.user._id,
      job: jobId,
      recruiter: job.recruiter,
      cvScore,
      skills
    });

    // Incrémenter le compteur d'applicants du job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });

    res.status(201).json({ success: true, application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }
    res.status(500).json({ message: 'Error applying', error: error.message });
  }
});

// GET /api/applications/my — Candidatures de l'étudiant
router.get('/my', protect, authorizeRole('student'), async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('job', 'title location duration')
      .populate('recruiter', 'companyName fullName')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// GET /api/applications/recruiter — Notifications du recruteur
router.get('/recruiter', protect, authorizeRole('recruiter'), async (req, res) => {
  try {
    const applications = await Application.find({ recruiter: req.user._id })
      .populate('student', 'fullName email university')
      .populate('job', 'title location')
      .sort({ createdAt: -1 });

    // Compter les non-vues
    const unseenCount = applications.filter(a => !a.seen).length;

    res.json({ success: true, applications, unseenCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// PATCH /api/applications/:id/seen — Marquer comme vue
router.patch('/:id/seen', protect, authorizeRole('recruiter'), async (req, res) => {
  try {
    await Application.findByIdAndUpdate(req.params.id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application' });
  }
});

// PATCH /api/applications/:id/status — Accepter/Rejeter
router.patch('/:id/status', protect, authorizeRole('recruiter'), async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, seen: true },
      { new: true }
    );
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
});

module.exports = router;