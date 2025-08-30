import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  status: string;
  createdAt: string;
  views: number;
  likes: any[];
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const response = await axios.get('/api/blogs/user/my-blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching user blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hidden': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-3xl">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.username}</h1>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              {user?.bio && <p className="text-gray-700">{user.bio}</p>}
              <div className="flex items-center gap-4 mt-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                  {user?.role === 'admin' ? '👑 Admin' : '✍️ Writer'}
                </span>
                <span className="text-gray-500">
                  📝 {blogs.length} blog{blogs.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <Link to="/create" className="btn-primary">
              Write New Blog
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">{blogs.length}</div>
            <div className="text-gray-600">Total Blogs</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">
              {blogs.filter(b => b.status === 'approved').length}
            </div>
            <div className="text-gray-600">Published</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {blogs.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">
              {blogs.reduce((total, blog) => total + blog.views, 0)}
            </div>
            <div className="text-gray-600">Total Views</div>
          </div>
        </div>

        {/* Blogs List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Blogs</h2>
            <Link to="/create" className="btn-primary">
              + New Blog
            </Link>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No blogs yet</h3>
              <p className="text-gray-600 mb-6">Start sharing your thoughts with the world!</p>
              <Link to="/create" className="btn-primary">
                Write Your First Blog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {blog.status === 'approved' ? (
                            <Link to={`/post/${blog._id}`} className="hover:text-purple-600">
                              {blog.title}
                            </Link>
                          ) : (
                            blog.title
                          )}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
                          {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span>👁 {blog.views} views</span>
                        <span>❤️ {blog.likes.length} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;