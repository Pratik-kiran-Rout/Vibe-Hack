import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import AdminAnalytics from '../components/AdminAnalytics';
import UserManagement from '../components/UserManagement';
import ContentReports from '../components/ContentReports';
import BulkActions from '../components/BulkActions';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  author: {
    username: string;
    email: string;
  };
  status: string;
  createdAt: string;
  views: number;
  likes: any[];
  category: string;
}

interface Stats {
  totalBlogs: number;
  pendingBlogs: number;
  approvedBlogs: number;
  rejectedBlogs: number;
  totalUsers: number;
}

const AdminDashboard: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [activeTab, setActiveTab] = useState<'blogs' | 'analytics' | 'users' | 'reports'>('blogs');
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const [blogsResponse, statsResponse] = await Promise.all([
        api.get(`/api/admin/blogs?status=${filter}`),
        api.get('/api/admin/stats')
      ]);
      
      setBlogs(blogsResponse.data.blogs);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBlogStatus = async (blogId: string, status: string) => {
    try {
      await api.put(`/api/admin/blogs/${blogId}/status`, { status });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating blog status:', error);
    }
  };

  const deleteBlog = async (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/api/admin/blogs/${blogId}`);
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
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
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('blogs')}
              className={`px-4 py-2 rounded-md font-medium transition-colors border ${
                activeTab === 'blogs'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-purple-400 text-white border-purple-400 hover:bg-purple-500'
              }`}
            >
              Blog Management
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-md font-medium transition-colors border ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-purple-400 text-white border-purple-400 hover:bg-purple-500'
              }`}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md font-medium transition-colors border ${
                activeTab === 'users'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-purple-400 text-white border-purple-400 hover:bg-purple-500'
              }`}
            >
              👥 Users
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-md font-medium transition-colors border ${
                activeTab === 'reports'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-purple-400 text-white border-purple-400 hover:bg-purple-500'
              }`}
            >
              🚨 Reports
            </button>
          </div>
        </div>

        {activeTab === 'blogs' ? (
          <>
            {/* Stats */}
            {stats && (
              <div className="grid md:grid-cols-5 gap-6 mb-8">
                <div className="card text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalBlogs}</div>
                  <div className="text-secondary">Total Blogs</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingBlogs}</div>
                  <div className="text-secondary">Pending</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.approvedBlogs}</div>
                  <div className="text-secondary">Approved</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.rejectedBlogs}</div>
                  <div className="text-secondary">Rejected</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
                  <div className="text-secondary">Total Users</div>
                </div>
              </div>
            )}

        {/* Filter Tabs */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
              {['draft', 'pending', 'approved', 'rejected', 'hidden'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors border ${
                    filter === status
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-purple-400 text-white border-purple-400 hover:bg-purple-500'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            
            {blogs.length > 0 && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBlogs.length === blogs.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBlogs(blogs.map(blog => blog._id));
                    } else {
                      setSelectedBlogs([]);
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm text-secondary">Select All</span>
              </label>
            )}
          </div>

          {/* Blogs List */}
          <div className="space-y-4">
            {blogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-secondary">No {filter} blogs found.</p>
              </div>
            ) : (
              blogs.map((blog) => (
                <div key={blog._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedBlogs.includes(blog._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBlogs(prev => [...prev, blog._id]);
                          } else {
                            setSelectedBlogs(prev => prev.filter(id => id !== blog._id));
                          }
                        }}
                        className="rounded mt-1"
                      />
                      <div className="flex-1">
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-secondary mb-3 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                          {blog.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted">
                        <span>👤 {blog.author.username}</span>
                        <span>📧 {blog.author.email}</span>
                        <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span>👁 {blog.views} views</span>
                        <span>❤️ {blog.likes.length} likes</span>
                      </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {blog.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateBlogStatus(blog._id, 'approved')}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateBlogStatus(blog._id, 'rejected')}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {blog.status === 'approved' && (
                        <button
                          onClick={() => updateBlogStatus(blog._id, 'hidden')}
                          className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                        >
                          Hide
                        </button>
                      )}
                      {blog.status === 'hidden' && (
                        <button
                          onClick={() => updateBlogStatus(blog._id, 'approved')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Unhide
                        </button>
                      )}
                      <button
                        onClick={() => deleteBlog(blog._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Bulk Actions for Blogs */}
          <BulkActions
            selectedItems={selectedBlogs}
            type="blogs"
            onActionComplete={() => {
              fetchData();
              setSelectedBlogs([]);
            }}
            onClearSelection={() => setSelectedBlogs([])}
          />
        </div>
          </>
        ) : activeTab === 'analytics' ? (
          <AdminAnalytics />
        ) : activeTab === 'users' ? (
          <UserManagement />
        ) : activeTab === 'reports' ? (
          <ContentReports />
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;