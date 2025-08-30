import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  author: {
    username: string;
    avatar?: string;
  };
  createdAt: string;
  views: number;
  likes: any[];
  readTime: number;
}

const Home: React.FC = () => {
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const [latestResponse, trendingResponse] = await Promise.all([
          axios.get('/api/blogs?limit=6'),
          axios.get('/api/blogs/trending')
        ]);
        
        setLatestBlogs(latestResponse.data.blogs);
        setTrendingBlogs(trendingResponse.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Welcome to <span className="gradient-text">DevNote</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover amazing stories, insights, and knowledge from our community of writers.
            Share your thoughts and connect with like-minded individuals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/blogs" className="btn-primary">
              Explore Blogs
            </Link>
            <Link to="/signup" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600">
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Latest Blogs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestBlogs.map((blog) => (
              <div key={blog._id} className="card hover:transform hover:scale-105 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  <Link to={`/post/${blog._id}`} className="hover:text-purple-600">
                    {blog.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {blog.author.username}</span>
                  <span>{blog.readTime} min read</span>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-4">
                    <span>👁 {blog.views}</span>
                    <span>❤️ {blog.likes.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/blogs" className="btn-primary">
              View All Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Blogs */}
      <section className="py-16 px-6 bg-white/10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Trending Now</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingBlogs.map((blog, index) => (
              <div key={blog._id} className="card">
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-purple-600">#{index + 1}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      <Link to={`/post/${blog._id}`} className="hover:text-purple-600">
                        {blog.title}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{blog.excerpt?.substring(0, 100) || 'No excerpt available'}...</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>👁 {blog.views}</span>
                      <span>❤️ {blog.likes.length}</span>
                      <span>By {blog.author.username}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Choose DevNote?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Easy Writing</h3>
              <p className="text-gray-600">Create beautiful blogs with our intuitive markdown editor and live preview.</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Get Discovered</h3>
              <p className="text-gray-600">Reach a wider audience with our trending algorithm and search features.</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Build Community</h3>
              <p className="text-gray-600">Connect with other writers and readers through comments and interactions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;