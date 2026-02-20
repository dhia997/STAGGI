const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.post('/message', protect, authorizeRole('student'), async (req, res) => {

  // Init OpenAI ici pour que .env soit bien chargé
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY
  });

  try {
    const { message, history } = req.body;

    if (!message) return res.status(400).json({ message: 'Message is required' });

    const messages = [
      {
        role: 'system',
        content: `You are an expert career coach for Tunisian students looking for internships.
You help with: CV improvement, interview preparation, and career advice.
Be friendly, concise, and practical.
Respond in the same language as the student (French or English).
Student name: ${req.user.fullName}`
      },
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model:'google/gemma-3-4b-it:free',
      messages
    });

    const reply = completion.choices[0].message.content;

    res.json({ success: true, reply });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Error getting AI response', error: error.message });
  }
});

module.exports = router;