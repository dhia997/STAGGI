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

    // 1. Extraire le texte du PDF
    const fullText = await extractPDFText(req.file.buffer);

    if (!fullText || fullText.trim().length < 50) {
      return res.status(400).json({ message: 'CV is empty or unreadable' });
    }

    const cvText = fullText.slice(0, 4000);

    // 2. Récupérer le prompt personnalisé de l'étudiant
    const userPrompt = req.body.prompt || '';

    // 3. Construire le prompt Groq avec le contexte personnalisé
    const prompt = `You are an expert CV analyzer for internship positions in Tunisia.

${userPrompt ? `IMPORTANT - Student context: "${userPrompt}". Use this context to give more personalized and relevant advice.` : ''}

Analyze this CV carefully and respond ONLY with a valid JSON object, no extra text, no markdown:
{
  "score": <number between 0 and 100>,
  "skills": [<list of technical skills found in the CV>],
  "advice": [<5 to 6 very specific, detailed, and actionable improvement tips based on the actual CV content>],
  "summary": "<one sentence describing the candidate profile>"
}

Scoring criteria:
- Technical skills relevance (30%)
- Work and project experience (25%)
- Education background (20%)
- CV structure and formatting (15%)
- Languages and certifications (10%)

Important for advice:
- Be very specific — mention actual skills, projects, or sections from the CV
- Give actionable steps the student can take immediately
- If student provided context, tailor advice to their specific internship goal

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