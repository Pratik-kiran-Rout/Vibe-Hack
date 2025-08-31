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
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [searchResults, setSearchResults] = useState<Blog[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Technology', 'Programming', 'Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'DevOps', 'Design', 'Career', 'Tutorial', 'News', 'Opinion', 'Other'];

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

  // Fetch blogs on page load and filter changes
  useEffect(() => {
    fetchBlogs();
  }, [currentPage, category, sortBy]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 3) {
        console.log('Triggering search for:', search);
        setCurrentPage(1);
        fetchBlogs();
      } else if (search.length === 0) {
        console.log('Clearing search');
        setCurrentPage(1);
        fetchBlogs();
      }
    }, 300); // Reduced delay

    return () => clearTimeout(timer);
  }, [search]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        sort: sortBy
      });
      
      if (search && search.length >= 3) {
        params.append('search', search);
        console.log('Searching for:', search);
      }
      if (category) params.append('category', category);
      
      const url = `/api/blogs?${params}`;
      console.log('Fetching blogs from:', url);
      
      const response = await api.get(url);
      console.log('Search response:', response.data);
      
      setBlogs(response.data.blogs || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
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

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blogs... (type 3+ characters to search)"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
              />
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
              >
                🔍 Filters
              </button>
              <button 
                onClick={() => {
                  console.log('Manual search test with:', search);
                  fetchBlogs();
                }}
                className="px-4 py-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              >
                Test Search
              </button>
            </div>
            
            {/* Filters */}
            {showFilters && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                    >
                      <option value="" className="text-gray-900">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="text-gray-900">{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                    >
                      <option value="createdAt" className="text-gray-900">Latest</option>
                      <option value="views" className="text-gray-900">Most Viewed</option>
                      <option value="likes" className="text-gray-900">Most Liked</option>
                      <option value="title" className="text-gray-900">Alphabetical</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearch('');
                        setCategory('');
                        setSortBy('createdAt');
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Search Results Info */}
            {search && search.length >= 3 && (
              <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
                {blogs.length > 0 ? (
                  `Found ${blogs.length} result${blogs.length !== 1 ? 's' : ''} for "${search}"`
                ) : (
                  `No results found for "${search}"`
                )}
              </div>
            )}
            
            {/* Search Hint */}
            {search && search.length > 0 && search.length < 3 && (
              <div className="text-sm text-gray-500 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                Type {3 - search.length} more character{3 - search.length !== 1 ? 's' : ''} to start searching...
              </div>
            )}
          </div>
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