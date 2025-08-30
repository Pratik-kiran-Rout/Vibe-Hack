const express = require('express');
const Blog = require('../models/Blog');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get subscription plans
router.get('/plans', (req, res) => {
  const plans = {
    free: {
      name: 'Free',
      price: 0,
      features: [
        'Create unlimited blogs',
        'Basic analytics',
        'Community access',
        'Standard support'
      ]
    },
    premium: {
      name: 'Premium',
      price: 9.99,
      features: [
        'All Free features',
        'Premium content access',
        'Advanced analytics',
        'Priority support',
        'Remove ads',
        'Custom themes'
      ]
    },
    pro: {
      name: 'Pro',
      price: 19.99,
      features: [
        'All Premium features',
        'Custom domain',
        'Monetization tools',
        'Sponsored post opportunities',
        'Advanced SEO tools',
        'White-label options'
      ]
    }
  };
  res.json(plans);
});

// Subscribe to premium
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!['premium', 'pro'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    // In a real implementation, integrate with Stripe here
    const user = await User.findById(req.user._id);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    user.subscription = {
      plan,
      startDate,
      endDate,
      stripeCustomerId: 'mock_customer_id',
      stripeSubscriptionId: 'mock_subscription_id'
    };

    await user.save();
    res.json({ message: 'Subscription activated successfully', subscription: user.subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send tip to author
router.post('/tip/:blogId', auth, async (req, res) => {
  try {
    const { amount, message } = req.body;
    
    if (!amount || amount < 1) {
      return res.status(400).json({ message: 'Invalid tip amount' });
    }

    const blog = await Blog.findById(req.params.blogId).populate('author');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // In a real implementation, process payment here
    blog.tips.push({
      user: req.user._id,
      amount,
      message: message || ''
    });

    // Update author earnings
    const author = await User.findById(blog.author._id);
    author.earnings.totalTips += amount;
    author.earnings.withdrawable += amount * 0.9; // 10% platform fee

    await Promise.all([blog.save(), author.save()]);

    res.json({ message: 'Tip sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get premium analytics
router.get('/analytics/premium', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.subscription.plan === 'free') {
      return res.status(403).json({ message: 'Premium subscription required' });
    }

    const blogs = await Blog.find({ author: req.user._id });
    
    // Advanced analytics calculations
    const analytics = {
      totalEarnings: user.earnings.totalTips + user.earnings.sponsoredPosts,
      monthlyGrowth: calculateMonthlyGrowth(blogs),
      topPerformingPosts: blogs
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
        .map(blog => ({
          title: blog.title,
          views: blog.views,
          likes: blog.likes.length,
          tips: blog.tips.reduce((sum, tip) => sum + tip.amount, 0)
        })),
      audienceInsights: {
        totalFollowers: user.followers?.length || 0,
        engagementRate: calculateEngagementRate(blogs),
        averageReadTime: blogs.reduce((sum, blog) => sum + (blog.analytics?.avgReadTime || 0), 0) / blogs.length
      },
      revenueBreakdown: {
        tips: user.earnings.totalTips,
        sponsoredPosts: user.earnings.sponsoredPosts,
        projectedMonthly: calculateProjectedRevenue(blogs)
      }
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Set custom domain
router.post('/custom-domain', auth, async (req, res) => {
  try {
    const { domain } = req.body;
    const user = await User.findById(req.user._id);

    if (user.subscription.plan !== 'pro') {
      return res.status(403).json({ message: 'Pro subscription required for custom domains' });
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({ message: 'Invalid domain format' });
    }

    user.customDomain = domain;
    await user.save();

    res.json({ message: 'Custom domain set successfully', domain });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Domain already taken' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create sponsored post
router.post('/sponsored-post', adminAuth, async (req, res) => {
  try {
    const { blogId, sponsorInfo } = req.body;
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.isSponsored = true;
    blog.sponsorInfo = sponsorInfo;
    await blog.save();

    // Update author earnings
    const author = await User.findById(blog.author);
    author.earnings.sponsoredPosts += sponsorInfo.amount;
    author.earnings.withdrawable += sponsorInfo.amount * 0.8; // 20% platform fee
    await author.save();

    res.json({ message: 'Sponsored post created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get earnings dashboard
router.get('/earnings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const blogs = await Blog.find({ author: req.user._id });

    const totalTips = blogs.reduce((sum, blog) => 
      sum + blog.tips.reduce((tipSum, tip) => tipSum + tip.amount, 0), 0
    );

    const earnings = {
      totalEarnings: user.earnings.totalTips + user.earnings.sponsoredPosts,
      withdrawable: user.earnings.withdrawable,
      thisMonth: calculateThisMonthEarnings(blogs),
      topTippedPosts: blogs
        .filter(blog => blog.tips.length > 0)
        .sort((a, b) => {
          const aTips = a.tips.reduce((sum, tip) => sum + tip.amount, 0);
          const bTips = b.tips.reduce((sum, tip) => sum + tip.amount, 0);
          return bTips - aTips;
        })
        .slice(0, 5)
        .map(blog => ({
          title: blog.title,
          tips: blog.tips.reduce((sum, tip) => sum + tip.amount, 0),
          tipCount: blog.tips.length
        }))
    };

    res.json(earnings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper functions
function calculateMonthlyGrowth(blogs) {
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const lastMonth = new Date(thisMonth);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const thisMonthBlogs = blogs.filter(blog => new Date(blog.createdAt) >= thisMonth);
  const lastMonthBlogs = blogs.filter(blog => 
    new Date(blog.createdAt) >= lastMonth && new Date(blog.createdAt) < thisMonth
  );

  return lastMonthBlogs.length > 0 
    ? ((thisMonthBlogs.length - lastMonthBlogs.length) / lastMonthBlogs.length * 100).toFixed(1)
    : 0;
}

function calculateEngagementRate(blogs) {
  const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
  const totalEngagements = blogs.reduce((sum, blog) => 
    sum + blog.likes.length + blog.comments.length, 0
  );
  
  return totalViews > 0 ? ((totalEngagements / totalViews) * 100).toFixed(2) : 0;
}

function calculateProjectedRevenue(blogs) {
  const recentBlogs = blogs.filter(blog => 
    new Date(blog.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  
  const avgTipsPerBlog = recentBlogs.reduce((sum, blog) => 
    sum + blog.tips.reduce((tipSum, tip) => tipSum + tip.amount, 0), 0
  ) / Math.max(recentBlogs.length, 1);

  return (avgTipsPerBlog * 4).toFixed(2); // Assuming 4 blogs per month
}

function calculateThisMonthEarnings(blogs) {
  const thisMonth = new Date();
  thisMonth.setDate(1);
  
  return blogs.reduce((sum, blog) => {
    const monthlyTips = blog.tips
      .filter(tip => new Date(tip.createdAt) >= thisMonth)
      .reduce((tipSum, tip) => tipSum + tip.amount, 0);
    return sum + monthlyTips;
  }, 0);
}

module.exports = router;