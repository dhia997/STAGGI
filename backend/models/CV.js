const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  advice: [{
    type: String
  }],
  skills: [{
    type: String
  }],
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('CV', cvSchema);