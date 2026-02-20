const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY
});

router.post('/message', protect, authorizeRole('student'), async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) return res.status(400).json({ message: 'Message is required' });

    // Construire l'historique pour le contexte
    const messages = [
      {
        role: 'system',
        content: `You are an expert career coach for Tunisian students looking for internships.
You help with: CV improvement, interview preparation, and career advice.
Be friendly, concise, and practical.
Respond in the same language as the student (French or English).
Student name: ${req.user.fullName}`
      },
      // Ajouter l'historique de la conversation
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      })),
      // Ajouter le nouveau message
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
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