const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Blog = require('../models/Blog');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Debug route to test admin login
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

// Reset and create admin route with manual login
router.get('/reset-admin', async (req, res) => {
  try {
    // Delete existing admin if any
    await User.deleteMany({ role: 'admin' });
    
    // Create fresh admin user with manual password hash
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = new User({
      username: 'admin',
      email: 'admin@devnote.com',
      password: hashedPassword,
      role: 'admin'
    });
    
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

// One-time admin setup route
router.get('/create-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create admin user (password will be hashed by User model pre-save hook)
    const admin = new User({
      username: 'admin',
      email: 'admin@devnote.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    
    res.json({ 
      message: 'Admin user created successfully',
      credentials: {
        email: 'admin@devnote.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
});

// Simple seed route that works immediately
router.get('/quick-seed', async (req, res) => {
  try {
    // Create a simple user first
    let user = await User.findOne({ email: 'demo@devnote.com' });
    if (!user) {
      user = new User({
        username: 'demo_user',
        email: 'demo@devnote.com',
        password: 'password123',
        role: 'user',
        bio: 'Demo user for sample content'
      });
      await user.save();
    }

    // Create simple blogs
    const blogs = [
      {
        title: "Welcome to DevNote!",
        content: "# Welcome to DevNote\n\nThis is your first blog post on DevNote! Start writing amazing content and share your knowledge with the developer community.\n\n## Getting Started\n\n1. Click on 'Write Blog' to create your first post\n2. Use markdown to format your content\n3. Add tags to help others discover your content\n\nHappy blogging!",
        excerpt: "Welcome to DevNote! Your journey as a developer blogger starts here.",
        author: user._id,
        category: "Other",
        tags: ["welcome", "getting-started"],
        status: "approved",
        readTime: 3,
        views: 150,
        shares: 5
      },
      {
        title: "JavaScript Tips Every Developer Should Know",
        content: "# JavaScript Tips\n\nHere are some essential JavaScript tips that will make you a better developer:\n\n## 1. Use const and let\n\n```javascript\nconst name = 'John';\nlet age = 25;\n```\n\n## 2. Arrow Functions\n\n```javascript\nconst add = (a, b) => a + b;\n```\n\n## 3. Template Literals\n\n```javascript\nconst message = \`Hello, \${name}!\`;\n```\n\nThese simple tips will improve your JavaScript code quality!",
        excerpt: "Essential JavaScript tips that every developer should know to write better code.",
        author: user._id,
        category: "Programming",
        tags: ["javascript", "tips", "programming"],
        status: "approved",
        readTime: 5,
        views: 320,
        shares: 12
      },
      {
        title: "Building Your First React App",
        content: "# React Tutorial\n\nLet's build your first React application step by step.\n\n## Setup\n\n```bash\nnpx create-react-app my-app\ncd my-app\nnpm start\n```\n\n## Your First Component\n\n```jsx\nfunction Welcome() {\n  return <h1>Hello, React!</h1>;\n}\n```\n\n## Adding State\n\n```jsx\nconst [count, setCount] = useState(0);\n```\n\nReact makes building interactive UIs simple and fun!",
        excerpt: "Learn how to build your first React application with this step-by-step tutorial.",
        author: user._id,
        category: "Web Development",
        tags: ["react", "tutorial", "frontend"],
        status: "approved",
        readTime: 8,
        views: 450,
        shares: 18
      }
    ];

    // Insert blogs
    let created = 0;
    for (const blogData of blogs) {
      const existing = await Blog.findOne({ title: blogData.title });
      if (!existing) {
        const blog = new Blog(blogData);
        await blog.save();
        created++;
      }
    }

    const totalBlogs = await Blog.countDocuments();
    
    res.json({
      success: true,
      message: 'Quick seed completed!',
      created: created,
      total: totalBlogs,
      user: user.username
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error in quick seed', 
      error: error.message 
    });
  }
});

// Seed database with sample blogs
router.get('/seed-blogs', async (req, res) => {
  try {
    // Sample users data
    const sampleUsers = [
      { username: 'sarah_dev', email: 'sarah@example.com', password: 'password123', bio: 'Full-stack developer passionate about React and Node.js' },
      { username: 'mike_coder', email: 'mike@example.com', password: 'password123', bio: 'Backend engineer specializing in Python and cloud architecture' },
      { username: 'alex_frontend', email: 'alex@example.com', password: 'password123', bio: 'Frontend developer and UI/UX enthusiast' },
      { username: 'jenny_data', email: 'jenny@example.com', password: 'password123', bio: 'Data scientist and machine learning engineer' },
      { username: 'tom_mobile', email: 'tom@example.com', password: 'password123', bio: 'Mobile app developer for iOS and Android' }
    ];

    // Create users if they don't exist
    const createdUsers = [];
    for (const userData of sampleUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        user = new User({ ...userData, password: hashedPassword });
        await user.save();
      }
      createdUsers.push(user);
    }

    // Sample blogs
    const sampleBlogs = [
      {
        title: "Getting Started with React Hooks: A Complete Guide",
        content: "# React Hooks: The Game Changer\n\nReact Hooks revolutionized how we write React components. Let's dive into the most essential hooks every developer should know.\n\n## useState Hook\n\nThe useState hook allows you to add state to functional components:\n\n```javascript\nimport React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```\n\n## useEffect Hook\n\nHandle side effects in your components:\n\n```javascript\nuseEffect(() => {\n  document.title = `You clicked ${count} times`;\n}, [count]);\n```\n\n## Best Practices\n\n1. Always use the dependency array in useEffect\n2. Keep hooks at the top level of your component\n3. Use custom hooks for reusable logic\n\nReact Hooks make your code more readable and maintainable. Start using them today!",
        excerpt: "Learn the essential React Hooks that every developer should master, from useState to useEffect and beyond.",
        category: "Programming",
        tags: ["React", "JavaScript", "Frontend", "Hooks"],
        status: "approved",
        readTime: 8
      },
      {
        title: "Building Scalable APIs with Node.js and Express",
        content: "# Scalable Node.js APIs\n\nBuilding APIs that can handle millions of requests requires careful planning and architecture decisions.\n\n## Project Structure\n\n```\nsrc/\n├── controllers/\n├── models/\n├── routes/\n├── middleware/\n├── utils/\n└── app.js\n```\n\n## Essential Middleware\n\n```javascript\nconst express = require('express');\nconst helmet = require('helmet');\nconst cors = require('cors');\nconst rateLimit = require('express-rate-limit');\n\nconst app = express();\n\n// Security\napp.use(helmet());\napp.use(cors());\n\n// Rate limiting\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 100 // limit each IP to 100 requests per windowMs\n});\napp.use(limiter);\n```\n\n## Performance Tips\n\n1. Use compression middleware\n2. Implement proper error handling\n3. Monitor with tools like New Relic\n4. Use clustering for CPU-intensive tasks\n\nBuilding scalable APIs is an art that requires continuous learning and optimization.",
        excerpt: "Learn how to build Node.js APIs that can scale to handle millions of requests with proper architecture and optimization techniques.",
        category: "Backend",
        tags: ["Node.js", "Express", "API", "Scalability"],
        status: "approved",
        readTime: 12
      },
      {
        title: "CSS Grid vs Flexbox: When to Use Which",
        content: "# CSS Grid vs Flexbox: The Ultimate Guide\n\nBoth CSS Grid and Flexbox are powerful layout systems, but they serve different purposes.\n\n## When to Use Flexbox\n\nFlexbox is perfect for:\n- One-dimensional layouts (rows or columns)\n- Aligning items within a container\n- Distributing space between items\n\n```css\n.flex-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n}\n```\n\n## When to Use CSS Grid\n\nCSS Grid excels at:\n- Two-dimensional layouts\n- Complex grid systems\n- Overlapping elements\n\n```css\n.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 2rem;\n}\n```\n\n## Pro Tips\n\n1. Use Grid for page layouts\n2. Use Flexbox for component layouts\n3. They work great together!\n4. Always consider browser support\n\nMaster both tools and choose the right one for each situation.",
        excerpt: "Understand the key differences between CSS Grid and Flexbox, and learn when to use each layout system for maximum effectiveness.",
        category: "Frontend",
        tags: ["CSS", "Grid", "Flexbox", "Layout"],
        status: "approved",
        readTime: 6
      },
      {
        title: "Machine Learning for Beginners: Your First Python Model",
        content: "# Your First Machine Learning Model\n\nLet's build a simple machine learning model to predict house prices using Python and scikit-learn.\n\n## Setting Up\n\n```bash\npip install pandas scikit-learn matplotlib\n```\n\n## Loading Data\n\n```python\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_squared_error\n\n# Load dataset\ndata = pd.read_csv('house_prices.csv')\nprint(data.head())\n```\n\n## Training the Model\n\n```python\n# Create and train model\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\n# Make predictions\npredictions = model.predict(X_test)\n\n# Evaluate\nmse = mean_squared_error(y_test, predictions)\nprint(f'Mean Squared Error: {mse}')\n```\n\n## Next Steps\n\n- Try different algorithms (Random Forest, XGBoost)\n- Feature engineering and selection\n- Cross-validation for better evaluation\n- Deploy your model to production\n\nMachine learning is a journey of continuous learning and experimentation!",
        excerpt: "Build your first machine learning model with Python! Learn the basics of data preparation, model training, and evaluation.",
        category: "Data Science",
        tags: ["Python", "Machine Learning", "Scikit-learn", "Beginner"],
        status: "approved",
        readTime: 10
      },
      {
        title: "Docker Containers: From Zero to Production",
        content: "# Docker: Containerizing Your Applications\n\nDocker revolutionized how we deploy and manage applications. Let's go from basics to production-ready containers.\n\n## Your First Dockerfile\n\n```dockerfile\n# Use official Node.js runtime\nFROM node:18-alpine\n\n# Set working directory\nWORKDIR /app\n\n# Copy package files\nCOPY package*.json ./\n\n# Install dependencies\nRUN npm ci --only=production\n\n# Copy application code\nCOPY . .\n\n# Expose port\nEXPOSE 3000\n\n# Define startup command\nCMD [\"npm\", \"start\"]\n```\n\n## Building and Running\n\n```bash\n# Build image\ndocker build -t my-app .\n\n# Run container\ndocker run -p 3000:3000 my-app\n```\n\n## Production Best Practices\n\n1. **Multi-stage builds** for smaller images\n2. **Non-root users** for security\n3. **Health checks** for monitoring\n4. **Resource limits** to prevent issues\n5. **Secrets management** for sensitive data\n\nDocker simplifies deployment and ensures consistency across all environments.",
        excerpt: "Master Docker containers from basics to production deployment. Learn Dockerfile best practices, Docker Compose, and production optimization.",
        category: "DevOps",
        tags: ["Docker", "Containers", "DevOps", "Deployment"],
        status: "approved",
        readTime: 11
      }
    ];

    // Create blogs
    let createdCount = 0;
    for (let i = 0; i < sampleBlogs.length; i++) {
      const blogData = sampleBlogs[i];
      const randomUser = createdUsers[i % createdUsers.length];
      
      // Check if blog already exists
      const existingBlog = await Blog.findOne({ title: blogData.title });
      if (!existingBlog) {
        const blog = new Blog({
          ...blogData,
          author: randomUser._id,
          views: Math.floor(Math.random() * 1000) + 50,
          likes: [],
          comments: [],
          shares: Math.floor(Math.random() * 50),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
        
        await blog.save();
        createdCount++;
      }
    }

    res.json({
      message: 'Database seeded successfully!',
      users: createdUsers.length,
      blogs: createdCount,
      totalBlogs: await Blog.countDocuments()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding database', error: error.message });
  }
});

module.exports = router;