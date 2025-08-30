const mongoose = require('mongoose');
const User = require('./models/User');
const Blog = require('./models/Blog');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Blog.deleteMany({});

    // Create admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@devnote.com',
      password: 'password123',
      role: 'admin'
    });
    await admin.save();

    // Create sample user
    const user = new User({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });
    await user.save();

    // Create sample blogs
    const blogs = [
      {
        title: 'Getting Started with React',
        excerpt: 'Learn the basics of React and build your first component.',
        content: 'React is a powerful JavaScript library for building user interfaces. In this tutorial, we will cover the fundamentals of React including components, props, and state management.',
        author: user._id,
        status: 'approved',
        tags: ['react', 'javascript', 'tutorial'],
        views: 150,
        readTime: 5
      },
      {
        title: 'Node.js Best Practices',
        excerpt: 'Essential tips for building scalable Node.js applications.',
        content: 'Node.js is a runtime environment that allows you to run JavaScript on the server. Here are some best practices for building robust and scalable applications.',
        author: user._id,
        status: 'approved',
        tags: ['nodejs', 'backend', 'javascript'],
        views: 200,
        readTime: 8
      },
      {
        title: 'MongoDB Database Design',
        excerpt: 'Learn how to design efficient MongoDB schemas.',
        content: 'MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. This guide covers schema design patterns and best practices.',
        author: admin._id,
        status: 'approved',
        tags: ['mongodb', 'database', 'nosql'],
        views: 120,
        readTime: 6
      }
    ];

    for (const blogData of blogs) {
      const blog = new Blog(blogData);
      await blog.save();
    }

    console.log('✅ Sample data created successfully!');
    console.log('Admin: admin@devnote.com / password123');
    console.log('User: john@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();