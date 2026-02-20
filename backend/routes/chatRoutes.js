const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.post('/message', protect, authorizeRole('student'), async (req, res) => {

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const { message, history, cvData } = req.body;

    if (!message) return res.status(400).json({ message: 'Message is required' });

    // Contexte CV de l'étudiant
    const cvContext = cvData && cvData.score ? `
STUDENT CV INFORMATION (use this to give personalized responses):
- CV Filename: ${cvData.filename || 'Unknown'}
- CV Score: ${cvData.score}/100
- Skills found in CV: ${cvData.skills?.join(', ') || 'None detected'}
- AI Advice already given:
${cvData.advice?.map((a, i) => `  ${i + 1}. ${a}`).join('\n') || 'None'}
` : 'The student has not uploaded a CV yet. Encourage them to upload their CV for personalized advice.';

    const systemContent = `You are an expert career coach for Tunisian students looking for internships.
Student name: ${req.user.fullName}.

${cvContext}

Your role:
- Answer questions about the student's CV specifically
- Explain the score and why they got it
- Give more details about the advice already provided
- Help them improve specific sections of their CV
- Prepare them for interviews
- Suggest internship opportunities based on their skills
- Be friendly, concise, and practical
- Respond in the same language as the student (French, English, or Arabic)`;

    const messages = [
      {
        role: 'system',
        content: systemContent
      },
      ...history
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({
          role: m.role,
          content: m.content
        })),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content;
    res.json({ success: true, reply });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Error getting AI response', error: error.message });
  }
});

module.exports = router;