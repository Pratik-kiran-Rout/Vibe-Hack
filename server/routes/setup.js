const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Blog = require('../models/Blog');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Reset and create admin route
router.get('/reset-admin', async (req, res) => {
  try {
    // Delete existing admin if any
    await User.deleteMany({ role: 'admin' });
    
    // Create fresh admin user with manual password hash
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Skip the pre-save hook by using insertOne
    await User.collection.insertOne({
      username: 'admin',
      email: 'admin@devnote.com',
      password: hashedPassword,
      role: 'admin',
      avatar: '',
      bio: '',
      followers: [],
      following: [],
      readingList: [],
      newsletterSubscription: false,
      subscription: {
        plan: 'free'
      },
      earnings: {
        totalTips: 0,
        sponsoredPosts: 0,
        withdrawable: 0
      },
      readingHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Test login immediately
    const testAdmin = await User.findOne({ email: 'admin@devnote.com' });
    const isMatch = await testAdmin.comparePassword('admin123');
    
    res.json({ 
      message: 'Admin user reset and created successfully',
      credentials: {
        email: 'admin@devnote.com',
        password: 'admin123'
      },
      passwordTest: isMatch
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting admin', error: error.message });
  }
});

// Test admin login
router.get('/test-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ email: 'admin@devnote.com' });
    if (!admin) {
      return res.json({ message: 'Admin not found' });
    }
    
    const isMatch = await admin.comparePassword('admin123');
    res.json({ 
      message: 'Admin found',
      passwordMatch: isMatch,
      adminRole: admin.role,
      adminId: admin._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error testing admin', error: error.message });
  }
});

// Create sample blogs
router.get('/create-blogs', async (req, res) => {
  try {
    // Create demo users first
    const demoUsers = [
      {
        username: 'sarah_dev',
        email: 'sarah@devnote.com',
        password: 'password123',
        bio: 'Full-stack developer passionate about React and Node.js'
      },
      {
        username: 'mike_coder', 
        email: 'mike@devnote.com',
        password: 'password123',
        bio: 'Backend engineer specializing in Python and cloud architecture'
      },
      {
        username: 'alex_frontend',
        email: 'alex@devnote.com', 
        password: 'password123',
        bio: 'Frontend developer and UI/UX enthusiast'
      }
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = new User(userData);
        await user.save();
      }
      createdUsers.push(user);
    }

    // Sample blog posts
    const sampleBlogs = [
      {
        title: "Getting Started with React Hooks",
        content: "# React Hooks: A Complete Guide\n\nReact Hooks have revolutionized how we write React components. Let's explore the most important hooks every developer should know.\n\n## useState Hook\n\nThe useState hook allows you to add state to functional components:\n\n```javascript\nimport React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```\n\n## useEffect Hook\n\nHandle side effects in your components:\n\n```javascript\nuseEffect(() => {\n  document.title = `You clicked ${count} times`;\n}, [count]);\n```\n\n## Best Practices\n\n1. Always use the dependency array in useEffect\n2. Keep hooks at the top level of your component\n3. Use custom hooks for reusable logic\n\nReact Hooks make your code more readable and maintainable!",
        excerpt: "Learn the essential React Hooks that every developer should master, from useState to useEffect and beyond.",
        category: "Programming",
        tags: ["React", "JavaScript", "Frontend", "Hooks"],
        status: "approved",
        readTime: 8,
        views: 245,
        shares: 12
      },
      {
        title: "Building REST APIs with Node.js",
        content: "# Building Scalable REST APIs\n\nNode.js and Express make it easy to build powerful REST APIs. Here's how to get started.\n\n## Setting Up Express\n\n```javascript\nconst express = require('express');\nconst app = express();\n\napp.use(express.json());\n\napp.get('/api/users', (req, res) => {\n  res.json({ users: [] });\n});\n\napp.listen(3000, () => {\n  console.log('Server running on port 3000');\n});\n```\n\n## Adding Middleware\n\n```javascript\nconst cors = require('cors');\nconst helmet = require('helmet');\n\napp.use(cors());\napp.use(helmet());\n```\n\n## Database Integration\n\nConnect to MongoDB using Mongoose:\n\n```javascript\nconst mongoose = require('mongoose');\n\nmongoose.connect('mongodb://localhost:27017/myapp')\n  .then(() => console.log('Connected to MongoDB'))\n  .catch(err => console.error('MongoDB connection error:', err));\n```\n\n## Best Practices\n\n1. Use proper HTTP status codes\n2. Implement error handling middleware\n3. Add input validation\n4. Use environment variables for configuration\n\nBuilding robust APIs requires attention to security, performance, and maintainability.",
        excerpt: "Learn how to build scalable REST APIs with Node.js and Express, including best practices for production applications.",
        category: "Backend", 
        tags: ["Node.js", "Express", "API", "Backend"],
        status: "approved",
        readTime: 10,
        views: 189,
        shares: 8
      },
      {
        title: "CSS Grid Layout Mastery",
        content: "# Mastering CSS Grid Layout\n\nCSS Grid is a powerful layout system that makes creating complex layouts simple and intuitive.\n\n## Basic Grid Setup\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 20px;\n}\n```\n\n## Grid Areas\n\nDefine named grid areas for easier layout management:\n\n```css\n.layout {\n  display: grid;\n  grid-template-areas:\n    \"header header header\"\n    \"sidebar main main\"\n    \"footer footer footer\";\n  grid-template-rows: auto 1fr auto;\n}\n\n.header { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main { grid-area: main; }\n.footer { grid-area: footer; }\n```\n\n## Responsive Grids\n\n```css\n.responsive-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1rem;\n}\n```\n\n## Advanced Techniques\n\n1. **Implicit vs Explicit Grids**: Understanding auto-placement\n2. **Grid Functions**: Using minmax(), fit-content(), and repeat()\n3. **Alignment**: Controlling item and content alignment\n4. **Subgrid**: Creating nested grid layouts\n\nCSS Grid gives you unprecedented control over your layouts!",
        excerpt: "Master CSS Grid layout with practical examples and learn how to create complex, responsive layouts with ease.",
        category: "Web Development",
        tags: ["CSS", "Grid", "Layout", "Frontend"],
        status: "approved", 
        readTime: 7,
        views: 156,
        shares: 6
      },
      {
        title: "JavaScript ES2024 Features",
        content: "# JavaScript ES2024: What's New\n\nJavaScript continues to evolve with exciting new features. Let's explore what ES2024 brings to the table.\n\n## Array Grouping\n\nGroup array elements by criteria:\n\n```javascript\nconst users = [\n  { name: 'Alice', department: 'Engineering' },\n  { name: 'Bob', department: 'Marketing' },\n  { name: 'Charlie', department: 'Engineering' }\n];\n\nconst grouped = Object.groupBy(users, user => user.department);\nconsole.log(grouped);\n// { Engineering: [...], Marketing: [...] }\n```\n\n## Promise.withResolvers()\n\nA cleaner way to create promises:\n\n```javascript\nconst { promise, resolve, reject } = Promise.withResolvers();\n\nsetTimeout(() => resolve('Done!'), 1000);\n```\n\n## Temporal API\n\nBetter date and time handling:\n\n```javascript\nconst now = Temporal.Now.plainDateTimeISO();\nconst birthday = Temporal.PlainDate.from('2024-12-25');\n```\n\n## Browser Support\n\nMost ES2024 features are supported in:\n- Chrome 120+\n- Firefox 121+ \n- Safari 17+\n- Node.js 21+\n\nStay updated with the latest JavaScript features to write more efficient code!",
        excerpt: "Discover the latest JavaScript ES2024 features including Array grouping, Promise.withResolvers(), and the new Temporal API.",
        category: "Programming",
        tags: ["JavaScript", "ES2024", "Web Development"],
        status: "approved",
        readTime: 6,
        views: 203,
        shares: 15
      },
      {
        title: "Docker for Developers",
        content: "# Docker: Containerizing Your Applications\n\nDocker has revolutionized how we develop, ship, and run applications. Let's learn the essentials.\n\n## What is Docker?\n\nDocker packages applications and their dependencies into lightweight, portable containers.\n\n## Your First Dockerfile\n\n```dockerfile\n# Use official Node.js runtime\nFROM node:18-alpine\n\n# Set working directory\nWORKDIR /app\n\n# Copy package files\nCOPY package*.json ./\n\n# Install dependencies\nRUN npm ci --only=production\n\n# Copy application code\nCOPY . .\n\n# Expose port\nEXPOSE 3000\n\n# Start the application\nCMD [\"npm\", \"start\"]\n```\n\n## Building and Running\n\n```bash\n# Build the image\ndocker build -t my-app .\n\n# Run the container\ndocker run -p 3000:3000 my-app\n```\n\n## Docker Compose\n\nManage multi-container applications:\n\n```yaml\nversion: '3.8'\nservices:\n  app:\n    build: .\n    ports:\n      - \"3000:3000\"\n    depends_on:\n      - db\n  \n  db:\n    image: postgres:13\n    environment:\n      POSTGRES_DB: myapp\n```\n\n## Best Practices\n\n1. Use multi-stage builds for smaller images\n2. Run containers as non-root users\n3. Use .dockerignore to exclude unnecessary files\n4. Keep images small and focused\n\nDocker simplifies deployment and ensures consistency across environments!",
        excerpt: "Learn Docker fundamentals and best practices for containerizing your applications and streamlining your development workflow.",
        category: "DevOps",
        tags: ["Docker", "Containers", "DevOps"],
        status: "approved",
        readTime: 9,
        views: 167,
        shares: 11
      }
    ];

    // Create blogs
    let createdBlogs = 0;
    for (let i = 0; i < sampleBlogs.length; i++) {
      const blogData = sampleBlogs[i];
      const author = createdUsers[i % createdUsers.length];
      
      const existingBlog = await Blog.findOne({ title: blogData.title });
      if (!existingBlog) {
        const blog = new Blog({
          ...blogData,
          author: author._id,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
        });
        
        await blog.save();
        createdBlogs++;
      }
    }

    const totalBlogs = await Blog.countDocuments();
    
    res.json({
      success: true,
      message: 'Sample blogs created successfully!',
      users: createdUsers.length,
      blogsCreated: createdBlogs,
      totalBlogs: totalBlogs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error creating blogs', 
      error: error.message 
    });
  }
});

// Direct seed route - guaranteed to work
router.get('/direct-seed', async (req, res) => {
  try {
    // Clear existing blogs
    await Blog.deleteMany({});
    
    // Create a simple user
    let user = await User.findOne({ email: 'demo@devnote.com' });
    if (!user) {
      user = new User({
        username: 'demo_user',
        email: 'demo@devnote.com', 
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        bio: 'Demo user for sample blogs'
      });
      await user.save();
    }

    // Create blogs directly
    const blogs = [
      {
        title: "Welcome to DevNote Platform",
        content: "# Welcome to DevNote!\n\nThis is your developer blogging platform. Start sharing your knowledge and connect with the community.\n\n## Features\n\n- Write in Markdown\n- Share with developers\n- Build your audience\n\nHappy blogging!",
        excerpt: "Welcome to DevNote - your developer blogging platform!",
        author: user._id,
        category: "Other",
        tags: ["welcome", "platform"],
        status: "approved",
        readTime: 2,
        views: 50,
        shares: 3,
        likes: [],
        comments: []
      },
      {
        title: "JavaScript Tips for Better Code",
        content: "# JavaScript Tips\n\nImprove your JavaScript with these essential tips:\n\n## Use const and let\n\n```javascript\nconst name = 'DevNote';\nlet count = 0;\n```\n\n## Arrow Functions\n\n```javascript\nconst greet = name => `Hello, ${name}!`;\n```\n\n## Destructuring\n\n```javascript\nconst { title, author } = blog;\n```\n\nThese tips will make your code cleaner and more maintainable!",
        excerpt: "Essential JavaScript tips to write better, cleaner code.",
        author: user._id,
        category: "Programming",
        tags: ["javascript", "tips", "coding"],
        status: "approved",
        readTime: 4,
        views: 125,
        shares: 7,
        likes: [],
        comments: []
      },
      {
        title: "React Components Best Practices",
        content: "# React Best Practices\n\nBuild better React components with these practices:\n\n## Functional Components\n\n```jsx\nfunction BlogCard({ title, excerpt }) {\n  return (\n    <div className=\"card\">\n      <h3>{title}</h3>\n      <p>{excerpt}</p>\n    </div>\n  );\n}\n```\n\n## Custom Hooks\n\n```jsx\nfunction useBlog(id) {\n  const [blog, setBlog] = useState(null);\n  // Hook logic here\n  return blog;\n}\n```\n\nFollow these patterns for maintainable React code!",
        excerpt: "Learn React best practices for building maintainable components.",
        author: user._id,
        category: "Web Development",
        tags: ["react", "components", "frontend"],
        status: "approved",
        readTime: 6,
        views: 89,
        shares: 5,
        likes: [],
        comments: []
      }
    ];

    // Insert blogs
    const createdBlogs = await Blog.insertMany(blogs);
    
    res.json({
      success: true,
      message: 'Direct seed completed successfully!',
      user: user.username,
      blogs: createdBlogs.length,
      blogTitles: createdBlogs.map(b => b.title)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Direct seed failed',
      error: error.message
    });
  }
});

module.exports = router;