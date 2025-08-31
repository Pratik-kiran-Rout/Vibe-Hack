import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface ReviewRequest {
  _id: string;
  blog: {
    _id: string;
    title: string;
    excerpt: string;
  };
  author: {
    username: string;
    avatar?: string;
  };
  status: string;
  createdAt: string;
}

const PeerReview: React.FC = () => {
  const { user } = useAuth();
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [userBlogs, setUserBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState('');
  const [activeTab, setActiveTab] = useState<'available' | 'request'>('available');

  useEffect(() => {
    if (user) {
      fetchReviewRequests();
      fetchUserBlogs();
    }
  }, [user]);

  const fetchReviewRequests = async () => {
    try {
      const response = await api.get('/api/community/reviews/requests');
      setReviewRequests(response.data);
    } catch (error) {
      console.error('Error fetching review requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      const response = await api.get('/api/blogs/user/my-blogs');
      setUserBlogs(response.data.filter((blog: any) => blog.status === 'approved'));
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    }
  };

  const handleRequestReview = async () => {
    if (!selectedBlog) return;

    try {
      await api.post('/api/community/reviews/request', {
        blogId: selectedBlog
      });
      setSelectedBlog('');
      alert('Review request submitted successfully!');
    } catch (error) {
      console.error('Error requesting review:', error);
      alert('Failed to request review');
    }
  };

  const handleAcceptReview = async (reviewId: string) => {
    try {
      await api.post(`/api/community/reviews/${reviewId}/accept`);
      fetchReviewRequests();
      alert('Review accepted! You can now provide feedback.');
    } catch (error) {
      console.error('Error accepting review:', error);
      alert('Failed to accept review');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Peer Review</h1>
          <p className="text-white/80">Please log in to access peer review features.</p>
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
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🔍 Peer Review</h1>
          <p className="text-white/80 text-lg">Get feedback from fellow writers and help others improve</p>
        </div>

        {/* Tab Navigation */}
        <div className="card mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'available'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Available Reviews ({reviewRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('request')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'request'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Request Review
            </button>
          </div>
        </div>

        {activeTab === 'available' ? (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📋 Available Review Requests
              </h3>
              
              {reviewRequests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-gray-600">No review requests available at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviewRequests.map((request) => (
                    <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            <Link 
                              to={`/post/${request.blog._id}`}
                              className="hover:text-purple-600"
                            >
                              {request.blog.title}
                            </Link>
                          </h4>
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {request.blog.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>By {request.author.username}</span>
                            <span>Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAcceptReview(request._id)}
                          className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Accept Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📝 Request Peer Review
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a blog for review
                </label>
                <select
                  value={selectedBlog}
                  onChange={(e) => setSelectedBlog(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose a blog...</option>
                  {userBlogs.map((blog) => (
                    <option key={blog._id} value={blog._id}>
                      {blog.title}
                    </option>
                  ))}
                </select>
              </div>

              {userBlogs.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    You need to have published blogs to request reviews.{' '}
                    <Link to="/create" className="text-yellow-600 hover:underline">
                      Write your first blog
                    </Link>
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">How Peer Review Works:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Submit your published blog for review</li>
                  <li>• Other writers will provide constructive feedback</li>
                  <li>• Reviews cover content, structure, clarity, and engagement</li>
                  <li>• Help others by reviewing their work too!</li>
                </ul>
              </div>

              <button
                onClick={handleRequestReview}
                disabled={!selectedBlog}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerReview;