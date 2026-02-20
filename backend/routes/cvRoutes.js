const express = require('express');
const router = express.Router();
const multer = require('multer');
const Groq = require('groq-sdk');
const os = require('os');
const path = require('path');
const fs = require('fs');
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

const extractPDFText = (buffer) => {
  return new Promise((resolve, reject) => {
    const extract = require('pdf-text-extract');
    const tmpPath = path.join(os.tmpdir(), `cv_${Date.now()}.pdf`);
    fs.writeFileSync(tmpPath, buffer);
    extract(tmpPath, (err, pages) => {
      try { fs.unlinkSync(tmpPath); } catch(e) {}
      if (err) reject(err);
      else resolve(pages.join('\n'));
    });
  });
};

router.post('/upload', protect, authorizeRole('student'), upload.single('cv'), async (req, res) => {

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fullText = await extractPDFText(req.file.buffer);

    if (!fullText || fullText.trim().length < 50) {
      return res.status(400).json({ message: 'CV is empty or unreadable' });
    }

    const cvText = fullText.slice(0, 4000);

    const prompt = `You are an expert CV analyzer for internship positions.
Analyze this CV and respond ONLY with a valid JSON object, no extra text, no markdown:
{
  "score": <number between 0 and 100>,
  "skills": [<list of technical skills found>],
  "advice": [<4 to 6 detailed and specific improvement tips, each at least 2 sentences>],
  "summary": "<2-3 sentences describing the candidate profile>"
}

Scoring criteria:
- Technical skills (30%)
- Work and project experience (25%)
- Education (20%)
- CV structure and formatting (15%)
- Languages and certifications (10%)

Be very specific — mention exact missing skills, exact improvements needed based on THIS CV.

CV Content:
${cvText}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });

    const responseText = completion.choices[0].message.content;
    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(cleanJson);

    const cv = await CV.create({
      student: req.user._id,
      filename: req.file.originalname,
      score: analysis.score,
      advice: analysis.advice,
      skills: analysis.skills
    });

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

router.get('/history', protect, authorizeRole('student'), async (req, res) => {
  try {
    const cvs = await CV.find({ student: req.user._id })
      .sort({ uploadedAt: -1 })
      .limit(10);
    res.json({ success: true, cvs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching CV history' });
  }
});
// GET /api/cv/:id
router.get('/:id', protect, authorizeRole('student'), async (req, res) => {
    try {
      const cv = await CV.findById(req.params.id);
      if (!cv) return res.status(404).json({ message: 'CV not found' });
      res.json({ success: true, cv });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching CV' });
    }
  });

module.exports = router;