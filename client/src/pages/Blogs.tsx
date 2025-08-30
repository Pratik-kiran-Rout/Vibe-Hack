import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdvancedSearch, { SearchFilters } from '../components/AdvancedSearch';
import PopularTags from '../components/PopularTags';
import AuthorRecommendations from '../components/AuthorRecommendations';

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
  category: string;
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    search: '',
    category: '',
    author: '',
    dateFrom: '',
    dateTo: '',
    tags: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });



  useEffect(() => {
    fetchBlogs();
  }, [currentPage, currentFilters]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '6',
        ...currentFilters
      });
      
      const response = await axios.get(`/api/search/blogs?${params}`);
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    setCurrentFilters(filters);
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    const newFilters = { ...currentFilters, tags: tag };
    setCurrentFilters(newFilters);
    setCurrentPage(1);
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

        {/* Advanced Search */}
        <div className="max-w-6xl mx-auto mb-12">
          <AdvancedSearch onSearch={handleSearch} loading={loading} />
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8 mb-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <PopularTags onTagClick={handleTagClick} />
            <AuthorRecommendations />
          </div>

          {/* Blogs Grid */}
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <div key={blog._id} className="card hover:transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                <Link to={`/post/${blog._id}`} className="hover:text-purple-600">
                  {blog.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
              
              {/* Category and Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                  {blog.category}
                </span>
                {blog.tags && blog.tags.length > 0 && (
                  blog.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))
                )}
              </div>

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
          <div className="lg:col-span-3 text-center py-12">
            <p className="text-white text-lg">No blogs found. Try a different search term.</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;