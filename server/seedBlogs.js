const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Blog = require('./models/Blog');

const sampleUsers = [
  {
    username: 'sarah_dev',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user',
    bio: 'Full-stack developer passionate about React and Node.js'
  },
  {
    username: 'mike_coder',
    email: 'mike@example.com', 
    password: 'password123',
    role: 'user',
    bio: 'Backend engineer specializing in Python and cloud architecture'
  },
  {
    username: 'alex_frontend',
    email: 'alex@example.com',
    password: 'password123', 
    role: 'user',
    bio: 'Frontend developer and UI/UX enthusiast'
  },
  {
    username: 'jenny_data',
    email: 'jenny@example.com',
    password: 'password123',
    role: 'user', 
    bio: 'Data scientist and machine learning engineer'
  },
  {
    username: 'tom_mobile',
    email: 'tom@example.com',
    password: 'password123',
    role: 'user',
    bio: 'Mobile app developer for iOS and Android'
  }
];

const sampleBlogs = [
  {
    title: "Getting Started with React Hooks: A Complete Guide",
    content: `# React Hooks: The Game Changer

React Hooks revolutionized how we write React components. Let's dive into the most essential hooks every developer should know.

## useState Hook

The useState hook allows you to add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

Handle side effects in your components:

\`\`\`javascript
useEffect(() => {
  document.title = \`You clicked \${count} times\`;
}, [count]);
\`\`\`

## Best Practices

1. Always use the dependency array in useEffect
2. Keep hooks at the top level of your component
3. Use custom hooks for reusable logic

React Hooks make your code more readable and maintainable. Start using them today!`,
    excerpt: "Learn the essential React Hooks that every developer should master, from useState to useEffect and beyond.",
    category: "Programming",
    tags: ["React", "JavaScript", "Frontend", "Hooks"],
    status: "approved",
    readTime: 8
  },
  {
    title: "Building Scalable APIs with Node.js and Express",
    content: `# Scalable Node.js APIs

Building APIs that can handle millions of requests requires careful planning and architecture decisions.

## Project Structure

\`\`\`
src/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
└── app.js
\`\`\`

## Essential Middleware

\`\`\`javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Security
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
\`\`\`

## Database Optimization

- Use connection pooling
- Implement proper indexing
- Cache frequently accessed data
- Use pagination for large datasets

## Performance Tips

1. Use compression middleware
2. Implement proper error handling
3. Monitor with tools like New Relic
4. Use clustering for CPU-intensive tasks

Building scalable APIs is an art that requires continuous learning and optimization.`,
    excerpt: "Learn how to build Node.js APIs that can scale to handle millions of requests with proper architecture and optimization techniques.",
    category: "Backend",
    tags: ["Node.js", "Express", "API", "Scalability"],
    status: "approved",
    readTime: 12
  },
  {
    title: "CSS Grid vs Flexbox: When to Use Which",
    content: `# CSS Grid vs Flexbox: The Ultimate Guide

Both CSS Grid and Flexbox are powerful layout systems, but they serve different purposes.

## When to Use Flexbox

Flexbox is perfect for:
- One-dimensional layouts (rows or columns)
- Aligning items within a container
- Distributing space between items

\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

## When to Use CSS Grid

CSS Grid excels at:
- Two-dimensional layouts
- Complex grid systems
- Overlapping elements

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

## Real-World Example

\`\`\`css
/* Card layout with Grid */
.card-grid {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar content"
    "footer footer";
  grid-template-rows: auto 1fr auto;
}

/* Card content with Flexbox */
.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
\`\`\`

## Pro Tips

1. Use Grid for page layouts
2. Use Flexbox for component layouts
3. They work great together!
4. Always consider browser support

Master both tools and choose the right one for each situation.`,
    excerpt: "Understand the key differences between CSS Grid and Flexbox, and learn when to use each layout system for maximum effectiveness.",
    category: "Frontend",
    tags: ["CSS", "Grid", "Flexbox", "Layout"],
    status: "approved",
    readTime: 6
  },
  {
    title: "Machine Learning for Beginners: Your First Python Model",
    content: `# Your First Machine Learning Model

Let's build a simple machine learning model to predict house prices using Python and scikit-learn.

## Setting Up

\`\`\`bash
pip install pandas scikit-learn matplotlib
\`\`\`

## Loading Data

\`\`\`python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# Load dataset
data = pd.read_csv('house_prices.csv')
print(data.head())
\`\`\`

## Preparing Features

\`\`\`python
# Select features
features = ['bedrooms', 'bathrooms', 'sqft_living', 'sqft_lot']
X = data[features]
y = data['price']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
\`\`\`

## Training the Model

\`\`\`python
# Create and train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, predictions)
print(f'Mean Squared Error: {mse}')
\`\`\`

## Key Concepts

1. **Features**: Input variables (bedrooms, bathrooms, etc.)
2. **Target**: What we're predicting (price)
3. **Training**: Teaching the model with data
4. **Evaluation**: Testing model performance

## Next Steps

- Try different algorithms (Random Forest, XGBoost)
- Feature engineering and selection
- Cross-validation for better evaluation
- Deploy your model to production

Machine learning is a journey of continuous learning and experimentation!`,
    excerpt: "Build your first machine learning model with Python! Learn the basics of data preparation, model training, and evaluation.",
    category: "Data Science",
    tags: ["Python", "Machine Learning", "Scikit-learn", "Beginner"],
    status: "approved",
    readTime: 10
  },
  {
    title: "Flutter vs React Native: Mobile Development in 2024",
    content: `# Flutter vs React Native: The 2024 Comparison

Choosing the right cross-platform framework can make or break your mobile app project.

## Performance Comparison

### Flutter
- Compiled to native ARM code
- Consistent 60fps performance
- Custom rendering engine (Skia)

### React Native
- JavaScript bridge communication
- Native component rendering
- Performance varies by platform

## Development Experience

### Flutter (Dart)
\`\`\`dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Flutter App')),
        body: Center(child: Text('Hello World!')),
      ),
    );
  }
}
\`\`\`

### React Native (JavaScript)
\`\`\`javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text>Hello World!</Text>
    </View>
  );
};
\`\`\`

## Ecosystem & Community

**React Native Advantages:**
- Larger community
- More third-party packages
- Easier to find developers
- Backed by Meta

**Flutter Advantages:**
- Growing rapidly
- Excellent documentation
- Strong Google support
- Hot reload feature

## When to Choose What

**Choose Flutter if:**
- Performance is critical
- You want pixel-perfect UI
- Team is willing to learn Dart

**Choose React Native if:**
- You have React developers
- Need extensive third-party integrations
- Faster time to market

## 2024 Verdict

Both frameworks are excellent choices. Flutter is gaining momentum with better performance, while React Native offers a larger ecosystem. Choose based on your team's expertise and project requirements.`,
    excerpt: "Compare Flutter and React Native in 2024. Discover which cross-platform framework is best for your mobile app development needs.",
    category: "Mobile",
    tags: ["Flutter", "React Native", "Mobile", "Cross-platform"],
    status: "approved",
    readTime: 9
  },
  {
    title: "Docker Containers: From Zero to Production",
    content: `# Docker: Containerizing Your Applications

Docker revolutionized how we deploy and manage applications. Let's go from basics to production-ready containers.

## What is Docker?

Docker packages applications and their dependencies into lightweight, portable containers that run consistently across environments.

## Your First Dockerfile

\`\`\`dockerfile
# Use official Node.js runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Define startup command
CMD ["npm", "start"]
\`\`\`

## Building and Running

\`\`\`bash
# Build image
docker build -t my-app .

# Run container
docker run -p 3000:3000 my-app

# Run in background
docker run -d -p 3000:3000 --name my-app-container my-app
\`\`\`

## Docker Compose for Multi-Service Apps

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=mongodb://db:27017/myapp
  
  db:
    image: mongo:5
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
\`\`\`

## Production Best Practices

1. **Multi-stage builds** for smaller images
2. **Non-root users** for security
3. **Health checks** for monitoring
4. **Resource limits** to prevent issues
5. **Secrets management** for sensitive data

## Advanced Example

\`\`\`dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
WORKDIR /app
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

Docker simplifies deployment and ensures consistency across all environments. Start containerizing your applications today!`,
    excerpt: "Master Docker containers from basics to production deployment. Learn Dockerfile best practices, Docker Compose, and production optimization.",
    category: "DevOps",
    tags: ["Docker", "Containers", "DevOps", "Deployment"],
    status: "approved",
    readTime: 11
  },
  {
    title: "JavaScript ES2024: New Features You Should Know",
    content: `# JavaScript ES2024: What's New

JavaScript continues to evolve with exciting new features in ES2024. Let's explore the most important additions.

## Array Grouping

Group array elements by a specific criteria:

\`\`\`javascript
const users = [
  { name: 'Alice', age: 25, department: 'Engineering' },
  { name: 'Bob', age: 30, department: 'Marketing' },
  { name: 'Charlie', age: 28, department: 'Engineering' }
];

// Group by department
const grouped = Object.groupBy(users, user => user.department);
console.log(grouped);
// {
//   Engineering: [{ name: 'Alice', ... }, { name: 'Charlie', ... }],
//   Marketing: [{ name: 'Bob', ... }]
// }
\`\`\`

## Promise.withResolvers()

A cleaner way to create promises:

\`\`\`javascript
// Old way
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

// New way
const { promise, resolve, reject } = Promise.withResolvers();

// Usage
setTimeout(() => resolve('Done!'), 1000);
\`\`\`

## Temporal API (Stage 3)

Better date and time handling:

\`\`\`javascript
// Current date and time
const now = Temporal.Now.plainDateTimeISO();

// Create specific dates
const birthday = Temporal.PlainDate.from('2024-12-25');

// Duration calculations
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });
const later = now.add(duration);
\`\`\`

## Array.fromAsync()

Create arrays from async iterables:

\`\`\`javascript
async function* asyncGenerator() {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  yield Promise.resolve(3);
}

const array = await Array.fromAsync(asyncGenerator());
console.log(array); // [1, 2, 3]
\`\`\`

## String.isWellFormed()

Check if strings are well-formed Unicode:

\`\`\`javascript
const validString = 'Hello 👋';
const invalidString = 'Hello \\uD800'; // Lone surrogate

console.log(validString.isWellFormed()); // true
console.log(invalidString.isWellFormed()); // false
\`\`\`

## RegExp v Flag

Enhanced Unicode support in regular expressions:

\`\`\`javascript
// Unicode property escapes
const regex = /\\p{Emoji}/v;
console.log(regex.test('👋')); // true

// Set notation
const emojiRegex = /[\\p{Emoji}--\\p{Emoji_Modifier_Base}]/v;
\`\`\`

## Browser Support

Most ES2024 features are already supported in:
- Chrome 120+
- Firefox 121+
- Safari 17+
- Node.js 21+

## Migration Tips

1. Use Babel for older browser support
2. Feature detection before usage
3. Progressive enhancement approach
4. TypeScript support coming soon

Stay updated with the latest JavaScript features to write more efficient and modern code!`,
    excerpt: "Discover the latest JavaScript ES2024 features including Array grouping, Promise.withResolvers(), Temporal API, and more exciting additions.",
    category: "Programming",
    tags: ["JavaScript", "ES2024", "Frontend", "Web Development"],
    status: "approved",
    readTime: 7
  },
  {
    title: "Building a REST API with Python FastAPI",
    content: `# FastAPI: Modern Python Web APIs

FastAPI is a modern, fast web framework for building APIs with Python 3.7+ based on standard Python type hints.

## Why FastAPI?

- **Fast**: Very high performance, on par with NodeJS and Go
- **Fast to code**: Increase development speed by 200-300%
- **Fewer bugs**: Reduce human-induced errors by 40%
- **Intuitive**: Great editor support with auto-completion
- **Standards-based**: Based on OpenAPI and JSON Schema

## Installation

\`\`\`bash
pip install fastapi uvicorn[standard]
\`\`\`

## Basic API

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Blog API", version="1.0.0")

class Post(BaseModel):
    id: Optional[int] = None
    title: str
    content: str
    author: str
    published: bool = False

# In-memory storage (use database in production)
posts = []

@app.get("/")
async def root():
    return {"message": "Welcome to Blog API"}

@app.get("/posts", response_model=List[Post])
async def get_posts():
    return posts

@app.post("/posts", response_model=Post)
async def create_post(post: Post):
    post.id = len(posts) + 1
    posts.append(post)
    return post

@app.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: int):
    for post in posts:
        if post.id == post_id:
            return post
    raise HTTPException(status_code=404, detail="Post not found")
\`\`\`

## Database Integration

\`\`\`python
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from fastapi import Depends

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./blog.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class PostDB(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    author = Column(String)
    published = Column(Boolean, default=False)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/posts", response_model=Post)
async def create_post(post: Post, db: Session = Depends(get_db)):
    db_post = PostDB(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post
\`\`\`

## Authentication

\`\`\`python
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException, status
import jwt

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

@app.post("/posts", response_model=Post)
async def create_post(
    post: Post, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    # Create post logic
    pass
\`\`\`

## Running the API

\`\`\`bash
uvicorn main:app --reload
\`\`\`

Visit `http://localhost:8000/docs` for interactive API documentation!

## Production Deployment

\`\`\`bash
# Install production server
pip install gunicorn

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
\`\`\`

FastAPI makes building modern APIs incredibly fast and enjoyable. The automatic documentation and type safety are game-changers!`,
    excerpt: "Learn to build modern, fast REST APIs with Python FastAPI. Includes database integration, authentication, and production deployment tips.",
    category: "Backend",
    tags: ["Python", "FastAPI", "REST API", "Backend"],
    status: "approved",
    readTime: 13
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Blog.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
    }
    console.log(`Created ${createdUsers.length} users`);

    // Create blogs
    const createdBlogs = [];
    for (let i = 0; i < sampleBlogs.length; i++) {
      const blogData = sampleBlogs[i];
      const randomUser = createdUsers[i % createdUsers.length];
      
      const blog = new Blog({
        ...blogData,
        author: randomUser._id,
        views: Math.floor(Math.random() * 1000) + 50,
        likes: [],
        comments: [],
        shares: Math.floor(Math.random() * 50),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      });
      
      const savedBlog = await blog.save();
      createdBlogs.push(savedBlog);
    }
    console.log(`Created ${createdBlogs.length} blogs`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();