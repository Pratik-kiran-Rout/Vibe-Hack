import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface HistoryItem {
  blog: {
    _id: string;
    title: string;
    excerpt: string;
    author: {
      username: string;
      avatar?: string;
    };
    category: string;
    readTime: number;
  };
  readAt: string;
  readTime: number;
}

const ReadingHistory: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReadingHistory();
    }
  }, [user]);

  const fetchReadingHistory = async () => {
    try {
      const response = await axios.get('/api/search/reading-history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching reading history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Reading History</h1>
          <p className="text-white/80">Please log in to view your reading history.</p>
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
          <h1 className="text-4xl font-bold text-white mb-4">📚 Reading History</h1>
          <p className="text-white/80 text-lg">
            {history.length} article{history.length !== 1 ? 's' : ''} read
          </p>
        </div>

        {history.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No reading history yet</h3>
            <p className="text-gray-600 mb-6">
              Start reading articles to build your history!
            </p>
            <Link to="/blogs" className="btn-primary">
              Explore Blogs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item, index) => (
              <div key={`${item.blog._id}-${index}`} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        <Link to={`/post/${item.blog._id}`} className="hover:text-purple-600">
                          {item.blog.title}
                        </Link>
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                        {item.blog.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{item.blog.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>By {item.blog.author.username}</span>
                        <span>{item.blog.readTime} min read</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>Read: {new Date(item.readAt).toLocaleDateString()}</span>
                        <span>Time spent: {Math.floor(item.readTime / 60)}m {item.readTime % 60}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingHistory;