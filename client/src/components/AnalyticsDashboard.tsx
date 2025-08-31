import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface DashboardData {
  writingStats: {
    totalBlogs: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    avgViewsPerBlog: number;
    engagementRate: string;
  };
  readingStats: {
    totalArticlesRead: number;
    totalReadingTime: number;
    savedArticles: number;
  };
  topBlogs: Array<{
    _id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    createdAt: string;
  }>;
  recentActivity: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/analytics/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Writing Statistics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-4">📝 Writing Statistics</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{data.writingStats.totalBlogs}</div>
            <div className="text-sm text-secondary">Total Blogs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.writingStats.totalViews.toLocaleString()}</div>
            <div className="text-sm text-secondary">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.writingStats.avgViewsPerBlog}</div>
            <div className="text-sm text-secondary">Avg Views/Blog</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{data.writingStats.engagementRate}%</div>
            <div className="text-sm text-secondary">Engagement Rate</div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">{data.writingStats.totalLikes}</div>
            <div className="text-sm text-secondary">Total Likes</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-indigo-600">{data.writingStats.totalComments}</div>
            <div className="text-sm text-secondary">Total Comments</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-teal-600">{data.writingStats.totalShares}</div>
            <div className="text-sm text-secondary">Total Shares</div>
          </div>
        </div>
      </div>

      {/* Reading Statistics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-4">📚 Reading Statistics</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{data.readingStats.totalArticlesRead}</div>
            <div className="text-sm text-secondary">Articles Read</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatTime(data.readingStats.totalReadingTime)}</div>
            <div className="text-sm text-secondary">Reading Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.readingStats.savedArticles}</div>
            <div className="text-sm text-secondary">Saved Articles</div>
          </div>
        </div>
      </div>

      {/* Top Performing Blogs */}
      {data.topBlogs.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-primary mb-4">🏆 Top Performing Blogs</h3>
          <div className="space-y-3">
            {data.topBlogs.map((blog, index) => (
              <div key={blog._id} className="flex items-center justify-between p-3 rounded-lg" style={{background: 'var(--bg-surface)'}}>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-purple-600">#{index + 1}</span>
                  <div>
                    <h4 className="font-medium text-primary line-clamp-1">{blog.title}</h4>
                    <div className="text-sm text-muted">
                      Published: {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-600">👁 {blog.views}</span>
                  <span className="text-red-600">❤️ {blog.likes}</span>
                  <span className="text-green-600">💬 {blog.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-4">📈 Recent Activity</h3>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{data.recentActivity}</div>
          <div className="text-secondary">Blogs published in the last 30 days</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;