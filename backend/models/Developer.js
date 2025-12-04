// backend/models/Developer.js
const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['Frontend', 'Backend', 'Full-Stack']
  },
  techStack: {
    type: [String],
    required: [true, 'Tech stack is required'],
    validate: {
      validator: function(arr) {
        return Array.isArray(arr) && arr.length > 0;
      },
      message: 'At least one technology is required'
    }
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  description: {
    type: String,
    default: '',
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  photo: {
    type: String,
    default: ''
  },
  joiningDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

/**
 * Example pre-save hook — run any transformations here.
 * Note: use an async hook WITHOUT 'next' param to avoid "next is not a function"
 * errors on some mongoose versions when the hook is async.
 */
developerSchema.pre('save', async function () {
  // ensure techStack is an array of trimmed strings (defensive)
  if (this.techStack && Array.isArray(this.techStack)) {
    this.techStack = this.techStack.map(t => String(t).trim()).filter(Boolean);
  } else if (typeof this.techStack === 'string') {
    this.techStack = this.techStack.split(',').map(t => String(t).trim()).filter(Boolean);
  } else {
    this.techStack = [];
  }

  // ensure experience is a number
  if (this.experience !== undefined && this.experience !== null) {
    this.experience = Number(this.experience);
  }

  // you can add other transformations here if needed
  return;
});

// Export model
module.exports = mongoose.model('Developer', developerSchema);
