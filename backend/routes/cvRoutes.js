const express = require('express');
const router = express.Router();
const multer = require('multer');
const OpenAI = require('openai');
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

router.post('/upload', protect, authorizeRole('student'), upload.single('cv'), async (req, res) => {
  
  // Init OpenAI ici pour que .env soit bien chargé
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY
  });

  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const cvText = req.file.buffer.toString('utf-8');

    const prompt = `You are an expert CV analyzer for internship positions.
Analyze this CV and respond ONLY with a valid JSON object, no extra text, no markdown:
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

CV Content:
${cvText}`;

    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [{ role: 'user', content: prompt }]
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

module.exports = router;