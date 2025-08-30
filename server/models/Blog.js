const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'hidden'],
    default: 'draft'
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Programming', 'Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'DevOps', 'Design', 'Career', 'Tutorial', 'News', 'Opinion', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: 500
    },
    mentions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  featuredImage: {
    type: String,
    default: ''
  },
  isDraft: {
    type: Boolean,
    default: true
  },
  readTime: {
    type: Number,
    default: 5
  },
  series: {
    name: {
      type: String,
      default: ''
    },
    part: {
      type: Number,
      default: 0
    }
  },
  shares: {
    type: Number,
    default: 0
  },
  analytics: {
    dailyViews: [{
      date: { type: Date, default: Date.now },
      views: { type: Number, default: 0 }
    }],
    referrers: [{
      source: String,
      count: { type: Number, default: 0 }
    }],
    avgReadTime: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for search functionality
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Virtual for like count
blogSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
blogSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for series blogs
blogSchema.virtual('seriesBlogs', {
  ref: 'Blog',
  localField: 'series.name',
  foreignField: 'series.name',
  match: function() {
    return { _id: { $ne: this._id }, 'series.name': { $ne: '' } };
  }
});

module.exports = mongoose.model('Blog', blogSchema);