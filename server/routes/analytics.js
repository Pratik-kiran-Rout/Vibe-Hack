const express = require('express');
const Blog = require('../models/Blog');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get blog analytics for author
router.get('/blog/:blogId', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId).populate('author', 'username');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const analytics = {
      totalViews: blog.views,
      totalLikes: blog.likes.length,
      totalComments: blog.comments.length,
      totalShares: blog.shares,
      dailyViews: blog.analytics?.dailyViews || [],
      referrers: blog.analytics?.referrers || [],
      avgReadTime: blog.analytics?.avgReadTime || 0,
      bounceRate: blog.analytics?.bounceRate || 0,
      engagementRate: blog.views > 0 ? ((blog.likes.length + blog.comments.length) / blog.views * 100).toFixed(2) : 0
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user dashboard analytics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user's blogs
    const userBlogs = await Blog.find({ author: userId });
    
    // Calculate statistics
    const totalBlogs = userBlogs.length;
    const totalViews = userBlogs.reduce((sum, blog) => sum + blog.views, 0);
    const totalLikes = userBlogs.reduce((sum, blog) => sum + blog.likes.length, 0);
    const totalComments = userBlogs.reduce((sum, blog) => sum + blog.comments.length, 0);
    const totalShares = userBlogs.reduce((sum, blog) => sum + (blog.shares || 0), 0);
    
    // Get reading history
    const user = await User.findById(userId);
    const readingStats = {
      totalArticlesRead: user.readingHistory?.length || 0,
      totalReadingTime: user.readingHistory?.reduce((sum, item) => sum + (item.readTime || 0), 0) || 0,
      savedArticles: user.readingList?.length || 0
    };

    // Blog performance over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentBlogs = userBlogs.filter(blog => new Date(blog.createdAt) >= thirtyDaysAgo);
    
    // Top performing blogs
    const topBlogs = userBlogs
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(blog => ({
        _id: blog._id,
        title: blog.title,
        views: blog.views,
        likes: blog.likes.length,
        comments: blog.comments.length,
        createdAt: blog.createdAt
      }));

    res.json({
      writingStats: {
        totalBlogs,
        totalViews,
        totalLikes,
        totalComments,
        totalShares,
        avgViewsPerBlog: totalBlogs > 0 ? Math.round(totalViews / totalBlogs) : 0,
        engagementRate: totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(2) : 0
      },
      readingStats,
      topBlogs,
      recentActivity: recentBlogs.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get admin analytics
router.get('/admin', adminAuth, async (req, res) => {
  try {
    // Platform statistics
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    // User growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const newBlogs = await Blog.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    
    // Top categories
    const topCategories = await Blog.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 }, views: { $sum: '$views' } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Top authors
    const topAuthors = await Blog.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$author', blogCount: { $sum: 1 }, totalViews: { $sum: '$views' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'author' } },
      { $unwind: '$author' },
      { $project: { username: '$author.username', blogCount: 1, totalViews: 1 } },
      { $sort: { totalViews: -1 } },
      { $limit: 10 }
    ]);

    // Daily activity (last 7 days)
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayUsers = await User.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });
      
      const dayBlogs = await Blog.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });
      
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        newUsers: dayUsers,
        newBlogs: dayBlogs
      });
    }

    res.json({
      overview: {
        totalUsers,
        totalBlogs,
        totalViews: totalViews[0]?.total || 0,
        newUsersThisMonth: newUsers,
        newBlogsThisMonth: newBlogs
      },
      topCategories,
      topAuthors,
      dailyStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Track page view with analytics
router.post('/track-view/:blogId', async (req, res) => {
  try {
    const { referrer, readTime } = req.body;
    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update daily views
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!blog.analytics) {
      blog.analytics = { dailyViews: [], referrers: [], avgReadTime: 0, bounceRate: 0 };
    }
    
    const todayView = blog.analytics.dailyViews.find(
      view => view.date.toDateString() === today.toDateString()
    );
    
    if (todayView) {
      todayView.views += 1;
    } else {
      blog.analytics.dailyViews.push({ date: today, views: 1 });
    }
    
    // Update referrer stats
    if (referrer) {
      const referrerStat = blog.analytics.referrers.find(r => r.source === referrer);
      if (referrerStat) {
        referrerStat.count += 1;
      } else {
        blog.analytics.referrers.push({ source: referrer, count: 1 });
      }
    }
    
    // Update average read time
    if (readTime) {
      const currentAvg = blog.analytics.avgReadTime || 0;
      const totalViews = blog.views + 1;
      blog.analytics.avgReadTime = ((currentAvg * blog.views) + readTime) / totalViews;
    }
    
    // Keep only last 30 days of daily views
    blog.analytics.dailyViews = blog.analytics.dailyViews
      .filter(view => view.date >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .slice(-30);
    
    await blog.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;