const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String },
  requirements: { type: String },
  skills: [{ type: String }],
  salary: { type: String },
  type: { type: String, default: 'internship' },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  applicants: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);