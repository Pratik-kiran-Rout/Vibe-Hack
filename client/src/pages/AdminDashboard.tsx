import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const [blogsResponse, statsResponse] = await Promise.all([
        axios.get(`/api/admin/blogs?status=${filter}`),
        axios.get('/api/admin/stats')
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
      await axios.put(`/api/admin/blogs/${blogId}/status`, { status });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating blog status:', error);
    }
  };

  const deleteBlog = async (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`/api/admin/blogs/${blogId}`);
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
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Stats */}
        {stats && (
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalBlogs}</div>
              <div className="text-gray-600">Total Blogs</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingBlogs}</div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approvedBlogs}</div>
              <div className="text-gray-600">Approved</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejectedBlogs}</div>
              <div className="text-gray-600">Rejected</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="card mb-8">
          <div className="flex gap-4 mb-6">
            {['pending', 'approved', 'rejected', 'hidden'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md font-medium ${
                  filter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Blogs List */}
          <div className="space-y-4">
            {blogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No {filter} blogs found.</p>
              </div>
            ) : (
              blogs.map((blog) => (
                <div key={blog._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>👤 {blog.author.username}</span>
                        <span>📧 {blog.author.email}</span>
                        <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span>👁 {blog.views} views</span>
                        <span>❤️ {blog.likes.length} likes</span>
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;