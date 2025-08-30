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
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12 py-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Welcome to <span className="text-gradient">DevNote</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover amazing articles, share your knowledge, and connect with developers worldwide
        </p>
<<<<<<< HEAD
        <AdvancedSearch onSearch={handleSearch} onClear={handleClearSearch} />
=======
        <div className="max-w-2xl mx-auto">
          <SearchBar onSearch={handleSearch} />
        </div>
>>>>>>> affeb88f4bbfdbed658101c827d382fed99e5aa7
      </div>

      {trendingBlogs.length > 0 && !searchResults && (
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <TrendingUp className="text-orange-500" size={28} />
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-orange-400 to-red-500"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingBlogs.slice(0, 3).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {searchResults ? 'Search Results' : 'Latest Articles'}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full"></div>
      </div>

      {displayBlogs.length > 0 ? (
<<<<<<< HEAD
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
=======
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
>>>>>>> affeb88f4bbfdbed658101c827d382fed99e5aa7
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchResults ? 'No articles found' : 'No articles yet'}
          </h3>
          <p className="text-gray-500 text-lg">
            {searchResults ? 'Try adjusting your search terms.' : 'Be the first to share your knowledge!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;