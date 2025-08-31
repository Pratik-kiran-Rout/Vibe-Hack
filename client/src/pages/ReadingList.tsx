import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface SavedBlog {
  _id: string;
  title: string;
  excerpt: string;
  author: {
    username: string;
    avatar?: string;
  };
  createdAt: string;
  readTime: number;
  category: string;
  savedAt: string;
}

const ReadingList: React.FC = () => {
  const { user } = useAuth();
  const [savedBlogs, setSavedBlogs] = useState<SavedBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReadingList();
    }
  }, [user]);

  const fetchReadingList = async () => {
    try {
      const response = await api.get('/api/social/reading-list');
      setSavedBlogs(response.data);
    } catch (error) {
      console.error('Error fetching reading list:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeBlog = async (blogId: string) => {
    try {
      await api.post(`/api/social/reading-list/${blogId}`);
      setSavedBlogs(prev => prev.filter(blog => blog._id !== blogId));
    } catch (error) {
      console.error('Error removing blog:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Reading List</h1>
          <p className="text-white/80">Please log in to view your reading list.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">📖 My Reading List</h1>
          <p className="text-white/80 text-lg">
            {savedBlogs.length} saved article{savedBlogs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {savedBlogs.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No saved articles yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your reading list by bookmarking interesting articles!
            </p>
            <Link to="/blogs" className="btn-primary">
              Explore Blogs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {savedBlogs.map((blog) => (
              <div key={blog._id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        <Link to={`/post/${blog._id}`} className="hover:text-purple-600">
                          {blog.title}
                        </Link>
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                        {blog.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>By {blog.author.username}</span>
                        <span>{blog.readTime} min read</span>
                        <span>Published: {new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span>Saved: {new Date(blog.savedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeBlog(blog._id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove from reading list"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingList;