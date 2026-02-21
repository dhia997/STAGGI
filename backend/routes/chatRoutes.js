const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Chat = require('../models/Chat');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// POST /api/chat/message
router.post('/message', protect, authorizeRole('student'), async (req, res) => {

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const { message, history, cvData, chatId } = req.body;

    if (!message) return res.status(400).json({ message: 'Message is required' });

    const cvContext = cvData && cvData.score ? `
STUDENT CV INFORMATION (use this to give personalized responses):
- CV Filename: ${cvData.filename || 'Unknown'}
- CV Score: ${cvData.score}/100
- Skills found in CV: ${cvData.skills?.join(', ') || 'None detected'}
- AI Advice already given:
${cvData.advice?.map((a, i) => `  ${i + 1}. ${a}`).join('\n') || 'None'}
` : 'The student has not uploaded a CV yet.';

    const systemContent = `You are an expert career coach for Tunisian students looking for internships.
Student name: ${req.user.fullName}.
${cvContext}
Your role:
- Answer questions about the student's CV specifically
- Explain the score and why they got it
- Give more details about the advice already provided
- Help them improve specific sections of their CV
- Prepare them for interviews
- Be friendly, concise, and practical
- Respond in the same language as the student (French, English, or Arabic)`;

    const messages = [
      { role: 'system', content: systemContent },
      ...history
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content;

    // Sauvegarder ou mettre à jour la conversation en MongoDB
    const newMessages = [
      ...history.filter(m => m.role === 'user' || m.role === 'assistant'),
      { role: 'user', content: message },
      { role: 'assistant', content: reply }
    ];

    let chat;
    if (chatId) {
      // Mettre à jour une conversation existante
      chat = await Chat.findByIdAndUpdate(
        chatId,
        { messages: newMessages },
        { new: true }
      );
    } else {
      // Créer une nouvelle conversation
      // Le titre = les 5 premiers mots du premier message
      const title = message.split(' ').slice(0, 5).join(' ') + '...';
      chat = await Chat.create({
        student: req.user._id,
        title,
        messages: newMessages,
        cvData: cvData || null
      });
    }

    res.json({ success: true, reply, chatId: chat._id });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Error getting AI response', error: error.message });
  }
});

// GET /api/chat/history
router.get('/history', protect, authorizeRole('student'), async (req, res) => {
  try {
    const chats = await Chat.find({ student: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('title updatedAt messages');

    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

// GET /api/chat/:id
router.get('/:id', protect, authorizeRole('student'), async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat' });
  }
});

module.exports = router;