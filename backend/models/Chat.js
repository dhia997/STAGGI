const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true }
});

const chatSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  messages: [messageSchema],
  cvData: {
    score: Number,
    skills: [String],
    advice: [String],
    filename: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);