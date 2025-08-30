import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  status: string;
  createdAt: string;
  views: number;
  likes: any[];
  category: string;
  isDraft: boolean;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [drafts, setDrafts] = useState<Blog[]>([]);
  const [activeTab, setActiveTab] = useState<'published' | 'drafts' | 'analytics'>('published');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [blogsResponse, draftsResponse] = await Promise.all([
          axios.get('/api/blogs/user/my-blogs'),
          axios.get('/api/blogs/user/drafts')
        ]);
        setBlogs(blogsResponse.data.filter((blog: Blog) => blog.status !== 'draft'));
        setDrafts(draftsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
              {drafts.length}
            </div>
            <div className="text-gray-600">Drafts</div>
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
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('published')}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === 'published'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Published ({blogs.length})
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === 'drafts'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Drafts ({drafts.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === 'analytics'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📊 Analytics
              </button>
            </div>
            <Link to="/create" className="btn-primary">
              + New Blog
            </Link>
          </div>

          {activeTab === 'published' ? (
            blogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No published blogs yet</h3>
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
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {blog.category}
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
            )
          ) : activeTab === 'drafts' ? (
            drafts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No drafts yet</h3>
                <p className="text-gray-600 mb-6">Save your work in progress here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {drafts.map((draft) => (
                  <div key={draft._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            <Link to={`/create/${draft._id}`} className="hover:text-purple-600">
                              {draft.title || 'Untitled Draft'}
                            </Link>
                          </h3>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">
                            Draft
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {draft.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {draft.excerpt || 'No excerpt yet...'}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span>📅 Last edited: {new Date(draft.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Link to={`/create/${draft._id}`} className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded">
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : activeTab === 'analytics' ? (
            <AnalyticsDashboard />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Profile;