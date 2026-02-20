const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.post('/message', protect, authorizeRole('student'), async (req, res) => {

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const { message, history } = req.body;

    if (!message) return res.status(400).json({ message: 'Message is required' });

    const messages = [
      {
        role: 'system',
        content: `You are an expert career coach for Tunisian students looking for internships.
Help with: CV improvement, interview preparation, and career advice.
Be friendly, detailed, and practical. Respond in the same language as the student (French or English).
Student name: ${req.user.fullName}.`
      },
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
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