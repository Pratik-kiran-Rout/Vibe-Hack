const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Blog = require('./models/Blog');

async function directSeed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Blog.deleteMany({});
    await User.deleteMany({ email: { $ne: 'admin@devnote.com' } }); // Keep admin
    console.log('Data cleared');

    // Create demo users
    console.log('Creating demo users...');
    const users = [];
    
    const userData = [
      { username: 'sarah_dev', email: 'sarah@devnote.com', bio: 'Full-stack developer' },
      { username: 'mike_coder', email: 'mike@devnote.com', bio: 'Backend engineer' },
      { username: 'alex_ui', email: 'alex@devnote.com', bio: 'Frontend developer' }
    ];

    for (const data of userData) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const user = new User({
        ...data,
        password: hashedPassword,
        role: 'user'
      });
      const savedUser = await user.save();
      users.push(savedUser);
      console.log(`Created user: ${data.username}`);
    }

    // Create blogs
    console.log('Creating blogs...');
    const blogData = [
      {
        title: "Getting Started with React Hooks",
        content: "# React Hooks Guide\\n\\nReact Hooks have changed how we write components. Here's what you need to know:\\n\\n## useState\\n\\n```javascript\\nconst [count, setCount] = useState(0);\\n```\\n\\n## useEffect\\n\\n```javascript\\nuseEffect(() => {\\n  // Side effects here\\n}, []);\\n```\\n\\nHooks make functional components powerful and easy to use!",
        excerpt: "Learn the essential React Hooks every developer should know.",
        category: "Programming",
        tags: ["React", "JavaScript", "Frontend"],
        status: "approved",
        readTime: 5,
        views: 150,
        shares: 8
      },
      {
        title: "Node.js Best Practices for 2024",
        content: "# Node.js Best Practices\\n\\nBuilding scalable Node.js applications requires following best practices:\\n\\n## Project Structure\\n\\n```\\nsrc/\\n├── controllers/\\n├── models/\\n├── routes/\\n└── middleware/\\n```\\n\\n## Security\\n\\n- Use helmet for security headers\\n- Validate all inputs\\n- Use rate limiting\\n\\n## Performance\\n\\n- Use compression\\n- Implement caching\\n- Monitor with APM tools\\n\\nFollow these practices for production-ready applications!",
        excerpt: "Essential Node.js best practices for building scalable applications.",
        category: "Backend", 
        tags: ["Node.js", "Backend", "Best Practices"],
        status: "approved",
        readTime: 7,
        views: 203,
        shares: 12
      },
      {
        title: "CSS Grid Layout Made Simple",
        content: "# CSS Grid Layout\\n\\nCSS Grid makes complex layouts simple and intuitive.\\n\\n## Basic Grid\\n\\n```css\\n.container {\\n  display: grid;\\n  grid-template-columns: repeat(3, 1fr);\\n  gap: 20px;\\n}\\n```\\n\\n## Grid Areas\\n\\n```css\\n.layout {\\n  grid-template-areas:\\n    \\\"header header\\\"\\n    \\\"sidebar main\\\"\\n    \\\"footer footer\\\";\\n}\\n```\\n\\n## Responsive Grids\\n\\n```css\\n.responsive {\\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\\n}\\n```\\n\\nCSS Grid gives you complete control over your layouts!",
        excerpt: "Master CSS Grid layout with practical examples and tips.",
        category: "Web Development",
        tags: ["CSS", "Grid", "Layout", "Frontend"],
        status: "approved",
        readTime: 6,
        views: 178,
        shares: 9
      },
      {
        title: "JavaScript ES2024 New Features",
        content: "# JavaScript ES2024\\n\\nExplore the latest JavaScript features in ES2024:\\n\\n## Array Grouping\\n\\n```javascript\\nconst grouped = Object.groupBy(users, user => user.department);\\n```\\n\\n## Promise.withResolvers()\\n\\n```javascript\\nconst { promise, resolve, reject } = Promise.withResolvers();\\n```\\n\\n## Temporal API\\n\\n```javascript\\nconst now = Temporal.Now.plainDateTimeISO();\\n```\\n\\nStay updated with the latest JavaScript features!",
        excerpt: "Discover the newest JavaScript ES2024 features and how to use them.",
        category: "Programming",
        tags: ["JavaScript", "ES2024", "Web Development"],
        status: "approved",
        readTime: 4,
        views: 134,
        shares: 6
      },
      {
        title: "Docker for Developers: Complete Guide",
        content: "# Docker for Developers\\n\\nContainerize your applications with Docker:\\n\\n## Dockerfile\\n\\n```dockerfile\\nFROM node:18-alpine\\nWORKDIR /app\\nCOPY package*.json ./\\nRUN npm ci\\nCOPY . .\\nEXPOSE 3000\\nCMD [\\\"npm\\\", \\\"start\\\"]\\n```\\n\\n## Docker Compose\\n\\n```yaml\\nversion: '3.8'\\nservices:\\n  app:\\n    build: .\\n    ports:\\n      - \\\"3000:3000\\\"\\n  db:\\n    image: postgres:13\\n```\\n\\nDocker simplifies deployment and ensures consistency!",
        excerpt: "Learn Docker fundamentals and containerize your applications effectively.",
        category: "DevOps",
        tags: ["Docker", "Containers", "DevOps"],
        status: "approved",
        readTime: 8,
        views: 167,
        shares: 11
      }
    ];

    for (let i = 0; i < blogData.length; i++) {
      const blog = new Blog({
        ...blogData[i],
        author: users[i % users.length]._id,
        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)) // Spread over days
      });
      
      await blog.save();
      console.log(`Created blog: ${blog.title}`);
    }

    console.log('\\n✅ Database seeded successfully!');
    console.log(`📝 Created ${blogData.length} blogs`);
    console.log(`👥 Created ${users.length} users`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
directSeed();