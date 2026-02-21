const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  cvScore: { type: Number },
  skills: [{ type: String }],
  seen: { type: Boolean, default: false }
}, { timestamps: true });

// Un étudiant ne peut postuler qu'une fois par job
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);