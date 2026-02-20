const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/chat/message
router.post('/message', protect, authorizeRole('student'), async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) return res.status(400).json({ message: 'Message is required' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    // Construire le contexte avec l'historique
    const systemContext = `
      You are an expert career coach for Tunisian students looking for internships.
      You help with: CV improvement, interview preparation, career advice.
      Be friendly, concise, and practical. Respond in the same language as the user.
      Student name: ${req.user.fullName}
    `;

    // Formater l'historique pour Gemini
    const conversationHistory = history
      .map(m => `${m.role === 'user' ? 'Student' : 'Coach'}: ${m.content}`)
      .join('\n');

    const fullPrompt = `
      ${systemContext}
      
      Conversation so far:
      ${conversationHistory}
      
      Student: ${message}
      Coach:
    `;

    const result = await model.generateContent(fullPrompt);
    const reply = result.response.text();

    res.json({ success: true, reply });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Error getting AI response' });
  }
});

module.exports = router;