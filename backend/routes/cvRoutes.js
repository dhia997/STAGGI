const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const CV = require('../models/CV');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// ── Multer config ──────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'), false);
  }
});

// ── Gemini init ────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/cv/upload
router.post('/upload', protect, authorizeRole('student'), upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 1. Convertir le PDF en base64 — Gemini lit directement le PDF
    const base64PDF = req.file.buffer.toString('base64');

    // 2. Envoyer à Gemini avec le PDF en base64
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert CV analyzer for internship positions.
      Analyze this CV document and respond ONLY with a valid JSON object, no extra text, no markdown backticks:
      {
        "score": <number between 0 and 100>,
        "skills": [<list of technical skills found>],
        "advice": [<4 to 6 specific improvement tips>],
        "summary": "<one sentence about the candidate>"
      }

      Scoring criteria:
      - Technical skills (30%)
      - Work and project experience (25%)
      - Education (20%)
      - CV structure and formatting (15%)
      - Languages and certifications (10%)
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64PDF
        }
      }
    ]);

    const responseText = result.response.text();

    // 3. Nettoyer et parser le JSON
    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(cleanJson);

    // 4. Sauvegarder en MongoDB
    const cv = await CV.create({
      student: req.user._id,
      filename: req.file.originalname,
      score: analysis.score,
      advice: analysis.advice,
      skills: analysis.skills
    });

    // 5. Retourner au frontend
    res.status(201).json({
      success: true,
      cv: {
        id: cv._id,
        filename: cv.filename,
        score: analysis.score,
        advice: analysis.advice,
        skills: analysis.skills,
        summary: analysis.summary,
        uploadedAt: cv.createdAt
      }
    });

  } catch (error) {
    console.error('CV Upload Error:', error);
    res.status(500).json({ message: 'Error analyzing CV', error: error.message });
  }
});

// GET /api/cv/history
router.get('/history', protect, authorizeRole('student'), async (req, res) => {
  try {
    const cvs = await CV.find({ student: req.user._id })
      .sort({ uploadedAt: -1 })
      .limit(10);

    res.json({ success: true, cvs });
  } catch (error) {
    console.error('CV History Error:', error);
    res.status(500).json({ message: 'Error fetching CV history' });
  }
});

module.exports = router;