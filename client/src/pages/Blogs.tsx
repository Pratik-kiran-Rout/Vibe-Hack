import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

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
  tags: string[];
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleLike = async (blogId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await api.post(`/api/blogs/${blogId}/like`);
      
      // Update like count locally
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog._id === blogId 
            ? { ...blog, likes: Array(response.data.likes).fill(null) }
            : blog
        )
      );
    } catch (error) {
      console.error('Error liking blog:', error);
      if (error.response?.status === 401) {
        alert('Please login to like blogs');
      }
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, search]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/blogs?page=${currentPage}&search=${search}&limit=9`);
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Explore Blogs</h1>
          <p className="text-white/80 text-lg">Discover amazing stories and insights from our community</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button type="submit" className="btn-primary px-8">
              Search
            </button>
          </form>
        </div>

        {/* Blogs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog) => (
            <Link key={blog._id} to={`/post/${blog._id}`} className="card hover:transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 hover:text-purple-600">
                {blog.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
              
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By {blog.author.username}</span>
                <span>{blog.readTime} min read</span>
              </div>
              <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-4">
                  <span>👁 {blog.views}</span>
                  <button 
                    onClick={(e) => handleLike(blog._id, e)}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    ❤️ {blog.likes.length}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {blogs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-white text-lg">No blogs found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;