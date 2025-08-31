import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

interface Report {
  user: {
    username: string;
  };
  reason: string;
  description: string;
  createdAt: string;
}

interface ReportedBlog {
  _id: string;
  title: string;
  excerpt: string;
  author: {
    username: string;
    email: string;
  };
  status: string;
  reports: Report[];
}

const ContentReports: React.FC = () => {
  const [reportedBlogs, setReportedBlogs] = useState<ReportedBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/api/admin-tools/reports');
      setReportedBlogs(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogAction = async (blogId: string, action: string) => {
    try {
      await api.put(`/api/admin/blogs/${blogId}/status`, { status: action });
      fetchReports(); // Refresh the list
    } catch (error) {
      console.error('Error updating blog status:', error);
    }
  };

  const getReasonColor = (reason: string) => {
    const colors = {
      spam: 'bg-red-100 text-red-600',
      inappropriate: 'bg-orange-100 text-orange-600',
      harassment: 'bg-red-100 text-red-600',
      copyright: 'bg-purple-100 text-purple-600',
      other: 'bg-gray-100 text-gray-600'
    };
    return colors[reason as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🚨 Reported Content ({reportedBlogs.length})
        </h3>

        {reportedBlogs.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-gray-600">No reported content to review</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reportedBlogs.map((blog) => (
              <div key={blog._id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      <Link to={`/post/${blog._id}`} className="hover:text-purple-600">
                        {blog.title}
                      </Link>
                    </h4>
                    <p className="text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>👤 {blog.author.username}</span>
                      <span>📧 {blog.author.email}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.status === 'approved' ? 'bg-green-100 text-green-600' :
                        blog.status === 'hidden' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {blog.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {blog.status !== 'hidden' && (
                      <button
                        onClick={() => handleBlogAction(blog._id, 'hidden')}
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                      >
                        Hide
                      </button>
                    )}
                    {blog.status === 'hidden' && (
                      <button
                        onClick={() => handleBlogAction(blog._id, 'approved')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Restore
                      </button>
                    )}
                    <button
                      onClick={() => handleBlogAction(blog._id, 'rejected')}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Reports */}
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-medium text-gray-800 mb-3">
                    Reports ({blog.reports.length})
                  </h5>
                  <div className="space-y-3">
                    {blog.reports.map((report, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-medium text-gray-800">
                                {report.user.username}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReasonColor(report.reason)}`}>
                                {report.reason}
                              </span>
                            </div>
                            {report.description && (
                              <p className="text-gray-600 text-sm">{report.description}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
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

export default ContentReports;