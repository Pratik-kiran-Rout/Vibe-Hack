const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  readingList: [{
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],
  newsletterSubscription: {
    type: Boolean,
    default: false
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  customDomain: {
    type: String,
    unique: true,
    sparse: true
  },
  earnings: {
    totalTips: {
      type: Number,
      default: 0
    },
    sponsoredPosts: {
      type: Number,
      default: 0
    },
    withdrawable: {
      type: Number,
      default: 0
    }
  },
  readingHistory: [{
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    },
    readAt: {
      type: Date,
      default: Date.now
    },
    readTime: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);