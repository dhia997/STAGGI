const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.post('/message', protect, authorizeRole('student'), async (req, res) => {

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const { message, history } = req.body;

    if (!message) return res.status(400).json({ message: 'Message is required' });

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: `You are an expert career coach for Tunisian students looking for internships.
Help with: CV improvement, interview preparation, and career advice.
Be friendly, detailed, and practical. Respond in the same language as the student (French or English).
Student name: ${req.user.fullName}.`
    });

    // Construire l'historique pour Gemini
    const chatHistory = history
      .filter(m => m.role !== 'assistant' || history.indexOf(m) !== 0)
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({ success: true, reply });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Error getting AI response', error: error.message });
  }
});

module.exports = router;