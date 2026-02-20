const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const CV = require('../models/CV');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'), false);
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/cv/upload
router.post('/upload', protect, authorizeRole('student'), upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // 1. Extraire texte du PDF
    const pdfData = await pdf(req.file.buffer);
    const cvText = pdfData.text;

    if (!cvText || cvText.trim().length < 50) {
      return res.status(400).json({ message: 'CV is empty or unreadable' });
    }

    // 2. Envoyer à Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      You are an expert CV analyzer for internship positions.
      Analyze this CV and respond ONLY with a valid JSON object, no extra text:
      {
        "score": <number 0-100>,
        "skills": [<technical skills found>],
        "advice": [<4 to 6 specific improvement tips>],
        "summary": "<one sentence about the profile>"
      }
      CV Content: ${cvText}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(cleanJson);

    // 3. Sauvegarder en MongoDB
    const cv = await CV.create({
      student: req.user._id,
      filename: req.file.originalname,
      score: analysis.score,
      advice: analysis.advice,
      skills: analysis.skills
    });

    // 4. Retourner au frontend
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
    res.status(500).json({ message: 'Error fetching history' });
  }
});

module.exports = router;