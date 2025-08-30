import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import { User, FileText, CheckCircle, Clock } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [userBlogs, setUserBlogs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [blogsRes, profileRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users/blogs'),
        axios.get('http://localhost:5000/api/users/profile')
      ]);
      
      setUserBlogs(blogsRes.data);
      setStats(profileRes.data.stats);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={32} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-sm rounded-full mt-2">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="text-blue-500" size={20} />
              <span className="text-gray-600">Total Blogs</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs || 0}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-gray-600">Published</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.approvedBlogs || 0}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="text-yellow-500" size={20} />
              <span className="text-gray-600">Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingBlogs || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Blogs</h2>

        {userBlogs.length > 0 ? (
          <div className="space-y-6">
            {userBlogs.map((blog) => (
              <div key={blog._id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {blog.content.substring(0, 200)}...
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(blog.status)}`}>
                    {blog.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Views: {blog.views || 0}</span>
                    <span>Likes: {blog.likesCount || 0}</span>
                    <span>Comments: {blog.commentsCount || 0}</span>
                  </div>
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">You haven't written any blogs yet</p>
            <a
              href="/create"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Write Your First Blog
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;