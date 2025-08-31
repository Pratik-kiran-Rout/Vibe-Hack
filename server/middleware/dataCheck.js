const Blog = require('../models/Blog');
const User = require('../models/User');

// Enhanced auto-restore with comprehensive data
const ensureDataExists = async (req, res, next) => {
  try {
    // Skip for setup routes
    if (req.path.includes('/setup/')) {
      return next();
    }

    // Check if we have any blogs and users
    const [blogCount, userCount] = await Promise.all([
      Blog.countDocuments(),
      User.countDocuments()
    ]);
    
    // If no data exists, auto-restore comprehensive data
    if (blogCount === 0 || userCount === 0) {
      console.log('🔄 Auto-restoring comprehensive data...');
      
      // Create multiple users
      const users = [];
      const userData = [
        { username: 'devnote_admin', email: 'admin@devnote.com', role: 'admin', bio: 'Platform Administrator' },
        { username: 'sarah_dev', email: 'sarah@devnote.com', role: 'user', bio: 'Full-stack developer' },
        { username: 'mike_coder', email: 'mike@devnote.com', role: 'user', bio: 'Backend engineer' },
        { username: 'alex_ui', email: 'alex@devnote.com', role: 'user', bio: 'Frontend specialist' }
      ];

      for (const data of userData) {
        let user = await User.findOne({ email: data.email });
        if (!user) {
          user = new User({ ...data, password: 'password123' });
          await user.save();
        }
        users.push(user);
      }

      // Create comprehensive blog data
      const comprehensiveBlogs = [
        {
          title: "Welcome to DevNote Platform",
          content: "# Welcome to DevNote!\n\nYour developer blogging platform is ready. Features:\n\n- Write blogs in Markdown\n- User authentication\n- Admin dashboard\n- Real-time features\n\nStart creating amazing content!",
          excerpt: "Welcome to DevNote - your complete developer blogging platform.",
          author: users[0]._id,
          category: "Other",
          tags: ["welcome", "platform"],
          status: "approved",
          readTime: 3,
          views: 25
        },
        {
          title: "React Hooks Complete Guide",
          content: "# React Hooks Mastery\n\n## useState Hook\n```javascript\nconst [count, setCount] = useState(0);\n```\n\n## useEffect Hook\n```javascript\nuseEffect(() => {\n  // Side effects\n}, []);\n```\n\n## Custom Hooks\nCreate reusable logic with custom hooks!",
          excerpt: "Master React Hooks with practical examples and best practices.",
          author: users[1]._id,
          category: "Programming",
          tags: ["react", "javascript", "hooks"],
          status: "approved",
          readTime: 8,
          views: 156
        },
        {
          title: "Node.js API Development",
          content: "# Building Scalable APIs\n\n## Express Setup\n```javascript\nconst express = require('express');\nconst app = express();\n\napp.get('/api/users', (req, res) => {\n  res.json({ users: [] });\n});\n```\n\n## Best Practices\n- Use middleware\n- Error handling\n- Input validation",
          excerpt: "Learn to build robust Node.js APIs with Express and best practices.",
          author: users[2]._id,
          category: "Programming",
          tags: ["nodejs", "api", "backend"],
          status: "approved",
          readTime: 10,
          views: 203
        },
        {
          title: "CSS Grid Layout Guide",
          content: "# CSS Grid Mastery\n\n## Basic Grid\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n```\n\n## Responsive Design\n```css\n.responsive {\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n}\n```",
          excerpt: "Master CSS Grid layout with practical examples and responsive design.",
          author: users[3]._id,
          category: "Web Development",
          tags: ["css", "grid", "layout"],
          status: "approved",
          readTime: 7,
          views: 134
        },
        {
          title: "JavaScript ES2024 Features",
          content: "# Modern JavaScript\n\n## Array Grouping\n```javascript\nconst grouped = Object.groupBy(users, u => u.dept);\n```\n\n## Promise.withResolvers\n```javascript\nconst { promise, resolve, reject } = Promise.withResolvers();\n```\n\nStay updated with the latest features!",
          excerpt: "Explore the newest JavaScript ES2024 features and modern syntax.",
          author: users[1]._id,
          category: "Programming",
          tags: ["javascript", "es2024", "modern"],
          status: "approved",
          readTime: 6,
          views: 189
        },
        {
          title: "Docker for Developers",
          content: "# Containerization Guide\n\n## Dockerfile\n```dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]\n```\n\nDocker simplifies deployment!",
          excerpt: "Learn Docker fundamentals for modern development workflows.",
          author: users[2]._id,
          category: "DevOps",
          tags: ["docker", "containers", "devops"],
          status: "approved",
          readTime: 9,
          views: 167
        }
      ];

      await Blog.insertMany(comprehensiveBlogs);
      console.log(`✅ Auto-restored ${users.length} users and ${comprehensiveBlogs.length} blogs`);
    }
    
    next();
  } catch (error) {
    console.error('Data check error:', error);
    next(); // Continue even if check fails
  }
};

// Periodic data check every 30 minutes
const startPeriodicCheck = () => {
  setInterval(async () => {
    try {
      const [blogCount, userCount] = await Promise.all([
        Blog.countDocuments(),
        User.countDocuments()
      ]);
      
      if (blogCount === 0 || userCount === 0) {
        console.log('🔄 Periodic check: Restoring missing data...');
        // Trigger the same restore logic
        const req = { path: '/api/blogs' }; // Dummy request
        const res = {};
        const next = () => {};
        await ensureDataExists(req, res, next);
      } else {
        console.log(`✅ Periodic check: ${userCount} users, ${blogCount} blogs - OK`);
      }
    } catch (error) {
      console.error('Periodic check error:', error);
    }
  }, 30 * 60 * 1000); // Every 30 minutes
};

module.exports = { ensureDataExists, startPeriodicCheck };