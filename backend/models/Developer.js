const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Full-Stack'],
  },
  techStack: {
    type: [String],
    required: true,
  },
  experience: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Developer', developerSchema);
