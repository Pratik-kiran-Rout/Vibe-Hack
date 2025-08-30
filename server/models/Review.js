const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  feedback: {
    content: {
      type: Number,
      min: 1,
      max: 5
    },
    structure: {
      type: Number,
      min: 1,
      max: 5
    },
    clarity: {
      type: Number,
      min: 1,
      max: 5
    },
    engagement: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  comments: {
    type: String,
    maxlength: 1000
  },
  suggestions: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'declined'],
    default: 'pending'
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);