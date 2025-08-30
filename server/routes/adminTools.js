const express = require('express');
const Blog = require('../models/Blog');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Bulk operations on blogs
router.post('/blogs/bulk-action', adminAuth, async (req, res) => {
  try {
    const { blogIds, action } = req.body;
    
    if (!blogIds || !Array.isArray(blogIds) || blogIds.length === 0) {
      return res.status(400).json({ message: 'Blog IDs are required' });
    }

    let updateData = {};
    switch (action) {
      case 'approve':
        updateData = { status: 'approved' };
        break;
      case 'reject':
        updateData = { status: 'rejected' };
        break;
      case 'hide':
        updateData = { status: 'hidden' };
        break;
      case 'delete':
        await Blog.deleteMany({ _id: { $in: blogIds } });
        return res.json({ message: `${blogIds.length} blogs deleted successfully` });
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    const result = await Blog.updateMany(
      { _id: { $in: blogIds } },
      updateData
    );

    res.json({ 
      message: `${result.modifiedCount} blogs ${action}d successfully`,
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Schedule blog publication
router.post('/blogs/:id/schedule', adminAuth, async (req, res) => {
  try {
    const { scheduledAt } = req.body;
    
    if (!scheduledAt) {
      return res.status(400).json({ message: 'Scheduled date is required' });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { 
        scheduledAt: new Date(scheduledAt),
        status: 'scheduled'
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ message: 'Blog scheduled successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get scheduled blogs
router.get('/blogs/scheduled', adminAuth, async (req, res) => {
  try {
    const scheduledBlogs = await Blog.find({
      status: 'scheduled',
      scheduledAt: { $exists: true }
    })
    .populate('author', 'username email')
    .sort({ scheduledAt: 1 })
    .select('-comments');

    res.json(scheduledBlogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User management - get all users with filters
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role = '' } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    // Get blog counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const blogCount = await Blog.countDocuments({ author: user._id });
        return {
          ...user.toObject(),
          blogCount
        };
      })
    );

    res.json({
      users: usersWithStats,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk user actions
router.post('/users/bulk-action', adminAuth, async (req, res) => {
  try {
    const { userIds, action } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs are required' });
    }

    let result;
    switch (action) {
      case 'promote':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { role: 'admin' }
        );
        break;
      case 'demote':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { role: 'user' }
        );
        break;
      case 'delete':
        // Also delete their blogs
        await Blog.deleteMany({ author: { $in: userIds } });
        result = await User.deleteMany({ _id: { $in: userIds } });
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    res.json({ 
      message: `${result.modifiedCount || result.deletedCount} users processed successfully`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Report content
router.post('/blogs/:id/report', async (req, res) => {
  try {
    const { reason, description } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user already reported this blog
    const existingReport = blog.reports.find(
      report => report.user.toString() === userId.toString()
    );

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this blog' });
    }

    blog.reports.push({
      user: userId,
      reason,
      description: description || ''
    });

    await blog.save();
    res.json({ message: 'Report submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reported content
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const reportedBlogs = await Blog.find({
      'reports.0': { $exists: true }
    })
    .populate('author', 'username email')
    .populate('reports.user', 'username')
    .sort({ 'reports.createdAt': -1 })
    .select('title excerpt reports status');

    res.json(reportedBlogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Email templates
const emailTemplates = {
  blogApproved: {
    subject: 'Your blog has been approved!',
    template: `
      <h2>Congratulations!</h2>
      <p>Your blog "<strong>{{blogTitle}}</strong>" has been approved and is now live on DevNote.</p>
      <p><a href="{{blogUrl}}">View your blog</a></p>
    `
  },
  blogRejected: {
    subject: 'Blog submission update',
    template: `
      <h2>Blog Review Update</h2>
      <p>Your blog "<strong>{{blogTitle}}</strong>" needs some revisions before it can be published.</p>
      <p>Reason: {{reason}}</p>
      <p>Please review our guidelines and resubmit.</p>
    `
  }
};

// Get email templates
router.get('/email-templates', adminAuth, (req, res) => {
  res.json(emailTemplates);
});

// Update email template
router.put('/email-templates/:type', adminAuth, (req, res) => {
  const { type } = req.params;
  const { subject, template } = req.body;

  if (!emailTemplates[type]) {
    return res.status(404).json({ message: 'Template not found' });
  }

  emailTemplates[type] = { subject, template };
  res.json({ message: 'Template updated successfully' });
});

module.exports = router;