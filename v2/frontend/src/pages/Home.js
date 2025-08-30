import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import AdvancedSearch from '../components/AdvancedSearch';
import Pagination from '../components/Pagination';
import { TrendingUp } from 'lucide-react';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBlogs(currentPage);
    fetchTrendingBlogs();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchBlogs = async (page = 1) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs?page=${page}&limit=9`);
      setBlogs(res.data.blogs);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/blogs/trending');
      setTrendingBlogs(res.data);
    } catch (error) {
      console.error('Error fetching trending blogs:', error);
    }
  };

  const handleSearch = async (filters) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const res = await axios.get(`http://localhost:5000/api/blogs/search?${params}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error('Error searching blogs:', error);
    }
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const displayBlogs = searchResults || blogs;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to DevNote
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Discover amazing articles and share your knowledge with the community
        </p>
        <AdvancedSearch onSearch={handleSearch} onClear={handleClearSearch} />
      </div>

      {trendingBlogs.length > 0 && !searchResults && (
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="text-orange-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingBlogs.slice(0, 3).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {searchResults ? 'Search Results' : 'Latest Articles'}
        </h2>
      </div>

      {displayBlogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
          
          {!searchResults && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchResults ? 'No blogs found for your search.' : 'No blogs available yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;