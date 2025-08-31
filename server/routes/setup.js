const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Blog = require('../models/Blog');

const router = express.Router();

// Simple admin creation
router.get('/create-admin', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.json({ message: 'Admin already exists', email: 'admin@devnote.com' });
    }

    const admin = new User({
      username: 'admin',
      email: 'admin@devnote.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    
    res.json({ 
      message: 'Admin created successfully',
      credentials: { email: 'admin@devnote.com', password: 'admin123' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
});

// Create 10+ diverse blogs
router.get('/create-many-blogs', async (req, res) => {
  try {
    // Create demo users
    const users = [];
    const userData = [
      { username: 'sarah_dev', email: 'sarah@devnote.com', bio: 'Full-stack developer' },
      { username: 'mike_coder', email: 'mike@devnote.com', bio: 'Backend engineer' },
      { username: 'alex_ui', email: 'alex@devnote.com', bio: 'Frontend specialist' },
      { username: 'jenny_data', email: 'jenny@devnote.com', bio: 'Data scientist' }
    ];

    for (const data of userData) {
      let user = await User.findOne({ email: data.email });
      if (!user) {
        user = new User({ ...data, password: 'password123' });
        await user.save();
      }
      users.push(user);
    }

    // Clear existing blogs
    await Blog.deleteMany({});

    // Create 12 diverse blogs
    const blogs = [
      {
        title: "Getting Started with React Hooks",
        content: "# React Hooks Guide\n\nReact Hooks revolutionized functional components:\n\n## useState\n```javascript\nconst [count, setCount] = useState(0);\n```\n\n## useEffect\n```javascript\nuseEffect(() => {\n  // Side effects\n}, []);\n```\n\nHooks make components powerful and reusable!",
        excerpt: "Master React Hooks with practical examples and best practices.",
        category: "Programming",
        tags: ["React", "JavaScript", "Frontend"],
        status: "approved",
        readTime: 8,
        views: 245
      },
      {
        title: "Node.js API Development Best Practices",
        content: "# Node.js API Best Practices\n\nBuild scalable APIs with these patterns:\n\n## Project Structure\n```\nsrc/\n├── controllers/\n├── models/\n├── routes/\n└── middleware/\n```\n\n## Security\n- Use helmet for headers\n- Validate inputs\n- Rate limiting\n\nFollow these for production-ready APIs!",
        excerpt: "Essential Node.js patterns for building scalable REST APIs.",
        category: "Backend",
        tags: ["Node.js", "API", "Backend"],
        status: "approved",
        readTime: 10,
        views: 189
      },
      {
        title: "CSS Grid Layout Mastery",
        content: "# CSS Grid Complete Guide\n\nMaster modern layouts with CSS Grid:\n\n## Basic Grid\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n```\n\n## Responsive Design\n```css\n.responsive {\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n}\n```\n\nGrid gives you complete layout control!",
        excerpt: "Complete guide to CSS Grid with practical examples.",
        category: "Web Development",
        tags: ["CSS", "Grid", "Layout"],
        status: "approved",
        readTime: 7,
        views: 156
      },
      {
        title: "Python Machine Learning Basics",
        content: "# ML with Python\n\nStart your ML journey with Python:\n\n## Setup\n```bash\npip install pandas scikit-learn matplotlib\n```\n\n## First Model\n```python\nfrom sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n```\n\nMachine learning made simple!",
        excerpt: "Begin machine learning with Python and scikit-learn.",
        category: "Data Science",
        tags: ["Python", "Machine Learning", "AI"],
        status: "approved",
        readTime: 12,
        views: 203
      },
      {
        title: "Docker for Developers",
        content: "# Docker Essentials\n\nContainerize your applications:\n\n## Dockerfile\n```dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]\n```\n\nDocker ensures consistency across environments!",
        excerpt: "Learn Docker fundamentals for modern development workflows.",
        category: "DevOps",
        tags: ["Docker", "Containers", "DevOps"],
        status: "approved",
        readTime: 9,
        views: 167
      },
      {
        title: "JavaScript ES2024 Features",
        content: "# JavaScript ES2024\n\nExplore the latest JS features:\n\n## Array Grouping\n```javascript\nconst grouped = Object.groupBy(users, u => u.dept);\n```\n\n## Promise.withResolvers\n```javascript\nconst { promise, resolve, reject } = Promise.withResolvers();\n```\n\nStay updated with modern JavaScript!",
        excerpt: "Discover the newest JavaScript ES2024 features and syntax.",
        category: "Programming",
        tags: ["JavaScript", "ES2024", "Web"],
        status: "approved",
        readTime: 6,
        views: 134
      },
      {
        title: "Flutter vs React Native 2024",
        content: "# Mobile Development Comparison\n\nChoose the right framework:\n\n## Flutter\n- Dart language\n- Single codebase\n- Great performance\n\n## React Native\n- JavaScript\n- Large community\n- Facebook backing\n\nBoth are excellent choices!",
        excerpt: "Compare Flutter and React Native for mobile development.",
        category: "Mobile Development",
        tags: ["Flutter", "React Native", "Mobile"],
        status: "approved",
        readTime: 8,
        views: 178
      },
      {
        title: "MongoDB Database Design",
        content: "# MongoDB Best Practices\n\nDesign efficient NoSQL databases:\n\n## Schema Design\n```javascript\nconst userSchema = {\n  _id: ObjectId,\n  username: String,\n  profile: {\n    bio: String,\n    avatar: String\n  }\n};\n```\n\nThink in documents, not tables!",
        excerpt: "Learn MongoDB schema design and optimization techniques.",
        category: "Backend",
        tags: ["MongoDB", "Database", "NoSQL"],
        status: "approved",
        readTime: 11,
        views: 145
      },
      {
        title: "TypeScript for JavaScript Developers",
        content: "# TypeScript Guide\n\nAdd type safety to JavaScript:\n\n## Basic Types\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n```\n\n## Generics\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n```\n\nTypeScript prevents runtime errors!",
        excerpt: "Master TypeScript to write safer, more maintainable code.",
        category: "Programming",
        tags: ["TypeScript", "JavaScript", "Types"],
        status: "approved",
        readTime: 9,
        views: 198
      },
      {
        title: "AWS Cloud Deployment Guide",
        content: "# Deploy to AWS\n\nHost your applications on AWS:\n\n## EC2 Setup\n1. Launch instance\n2. Configure security groups\n3. Deploy application\n\n## S3 for Static Files\n```bash\naws s3 sync ./build s3://my-bucket\n```\n\nAWS provides scalable infrastructure!",
        excerpt: "Complete guide to deploying applications on AWS cloud.",
        category: "DevOps",
        tags: ["AWS", "Cloud", "Deployment"],
        status: "approved",
        readTime: 13,
        views: 167
      },
      {
        title: "Git Workflow Best Practices",
        content: "# Git Mastery\n\nImprove your Git workflow:\n\n## Branching Strategy\n```bash\ngit checkout -b feature/new-feature\ngit add .\ngit commit -m \"Add feature\"\ngit push origin feature/new-feature\n```\n\n## Merge vs Rebase\nChoose based on team preferences!\n\nGood Git habits save time!",
        excerpt: "Master Git workflows and collaboration best practices.",
        category: "Other",
        tags: ["Git", "Version Control", "Workflow"],
        status: "approved",
        readTime: 7,
        views: 123
      },
      {
        title: "Web Performance Optimization",
        content: "# Speed Up Your Website\n\nOptimize for better performance:\n\n## Image Optimization\n- Use WebP format\n- Lazy loading\n- Proper sizing\n\n## Code Splitting\n```javascript\nconst LazyComponent = lazy(() => import('./Component'));\n```\n\nFast websites rank better!",
        excerpt: "Essential techniques to optimize web application performance.",
        category: "Web Development",
        tags: ["Performance", "Optimization", "Web"],
        status: "approved",
        readTime: 10,
        views: 189
      }
    ];

    // Assign random authors and create blogs
    const createdBlogs = [];
    for (let i = 0; i < blogs.length; i++) {
      const blog = {
        ...blogs[i],
        author: users[i % users.length]._id,
        createdAt: new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000)) // Spread over days
      };
      createdBlogs.push(blog);
    }

    await Blog.insertMany(createdBlogs);
    
    res.json({
      success: true,
      message: 'Multiple blogs created successfully!',
      count: createdBlogs.length,
      users: users.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blogs', error: error.message });
  }
});

// Simple blog seeding (original)
router.get('/seed-blogs', async (req, res) => {
  try {
    let user = await User.findOne({ email: 'demo@devnote.com' });
    if (!user) {
      user = new User({
        username: 'demo_user',
        email: 'demo@devnote.com',
        password: 'password123',
        bio: 'Demo user'
      });
      await user.save();
    }

    const existingBlogs = await Blog.countDocuments();
    if (existingBlogs > 0) {
      return res.json({ message: 'Blogs already exist', count: existingBlogs });
    }

    const blogs = [
      {
        title: "Welcome to DevNote",
        content: "# Welcome!\n\nThis is your first blog post on DevNote. Start writing amazing content!",
        excerpt: "Welcome to DevNote - start your blogging journey here!",
        author: user._id,
        category: "Other",
        tags: ["welcome"],
        status: "approved",
        readTime: 1,
        views: 10
      },
      {
        title: "JavaScript Basics",
        content: "# JavaScript Basics\n\nLearn the fundamentals of JavaScript programming.",
        excerpt: "Essential JavaScript concepts every developer should know.",
        author: user._id,
        category: "Programming", 
        tags: ["javascript"],
        status: "approved",
        readTime: 5,
        views: 25
      }
    ];

    const createdBlogs = await Blog.insertMany(blogs);
    
    res.json({
      success: true,
      message: 'Blogs created successfully',
      count: createdBlogs.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blogs', error: error.message });
  }
});

module.exports = router;