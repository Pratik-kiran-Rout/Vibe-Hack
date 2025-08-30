const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  prompt: {
    type: String,
    required: true,
    maxlength: 1000
  },
  description: {
    type: String,
    maxlength: 500
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  prizes: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);