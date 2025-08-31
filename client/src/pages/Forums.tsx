import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface Forum {
  _id: string;
  title: string;
  description: string;
  category: string;
  author: {
    username: string;
    avatar?: string;
  };
  posts: any[];
  tags: string[];
  isPinned: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

const Forums: React.FC = () => {
  const { user } = useAuth();
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newForum, setNewForum] = useState({
    title: '',
    description: '',
    category: 'General',
    tags: ''
  });

  const categories = ['General', 'Writing Tips', 'Tech Discussion', 'Career', 'Feedback', 'Challenges'];

  useEffect(() => {
    fetchForums();
  }, [selectedCategory]);

  const fetchForums = async () => {
    try {
      const params = selectedCategory ? `?category=${selectedCategory}` : '';
      const response = await api.get(`/api/community/forums${params}`);
      setForums(response.data);
    } catch (error) {
      console.error('Error fetching forums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const forumData = {
        ...newForum,
        tags: newForum.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      await api.post('/api/community/forums', forumData);
      setShowCreateForm(false);
      setNewForum({ title: '', description: '', category: 'General', tags: '' });
      fetchForums();
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

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
          <h1 className="text-4xl font-bold text-white mb-4">💬 Community Forums</h1>
          <p className="text-white/80 text-lg">Join discussions and connect with fellow writers</p>
        </div>

        {/* Category Filter */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === '' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {user && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary"
              >
                + New Discussion
              </button>
            )}
          </div>
        </div>

        {/* Create Forum Form */}
        {showCreateForm && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Start New Discussion</h3>
            <form onSubmit={handleCreateForum} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newForum.title}
                  onChange={(e) => setNewForum(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Discussion title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <textarea
                  value={newForum.description}
                  onChange={(e) => setNewForum(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What would you like to discuss?"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={newForum.category}
                  onChange={(e) => setNewForum(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newForum.tags}
                  onChange={(e) => setNewForum(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Tags (comma separated)"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Create Discussion</button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Forums List */}
        <div className="space-y-4">
          {forums.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">💭</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No discussions yet</h3>
              <p className="text-gray-600 mb-6">Be the first to start a conversation!</p>
              {user && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary"
                >
                  Start Discussion
                </button>
              )}
            </div>
          ) : (
            forums.map((forum) => (
              <div key={forum._id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {forum.isPinned && <span className="text-yellow-500">📌</span>}
                      <h3 className="text-lg font-semibold text-gray-800">
                        <Link to={`/forums/${forum._id}`} className="hover:text-purple-600">
                          {forum.title}
                        </Link>
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                        {forum.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{forum.description}</p>
                    
                    {forum.tags.length > 0 && (
                      <div className="flex gap-1 mb-3">
                        {forum.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>By {forum.author.username}</span>
                        <span>{new Date(forum.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>👁 {forum.views}</span>
                        <span>💬 {forum.posts.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Forums;