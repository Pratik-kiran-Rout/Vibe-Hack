import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AdminAnalyticsData {
  overview: {
    totalUsers: number;
    totalBlogs: number;
    totalViews: number;
    newUsersThisMonth: number;
    newBlogsThisMonth: number;
  };
  topCategories: Array<{
    _id: string;
    count: number;
    views: number;
  }>;
  topAuthors: Array<{
    _id: string;
    username: string;
    blogCount: number;
    totalViews: number;
  }>;
  dailyStats: Array<{
    date: string;
    newUsers: number;
    newBlogs: number;
  }>;
}

const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/analytics/admin');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Platform Overview</h3>
        <div className="grid md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{data.overview.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-xs text-green-600">+{data.overview.newUsersThisMonth} this month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.overview.totalBlogs.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Blogs</div>
            <div className="text-xs text-green-600">+{data.overview.newBlogsThisMonth} this month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.overview.totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(data.overview.totalViews / data.overview.totalBlogs)}</div>
            <div className="text-sm text-gray-600">Avg Views/Blog</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{Math.round(data.overview.totalBlogs / data.overview.totalUsers * 100) / 100}</div>
            <div className="text-sm text-gray-600">Blogs/User</div>
          </div>
        </div>
      </div>

      {/* Daily Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Daily Activity (Last 7 Days)</h3>
        <div className="space-y-3">
          {data.dailyStats.map((day) => (
            <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-purple-600">👥 {day.newUsers} users</span>
                <span className="text-blue-600">📝 {day.newBlogs} blogs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🏷️ Top Categories</h3>
        <div className="space-y-3">
          {data.topCategories.slice(0, 8).map((category, index) => (
            <div key={category._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-purple-600">#{index + 1}</span>
                <span className="font-medium text-gray-800">{category._id}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-600">{category.count} blogs</span>
                <span className="text-green-600">{category.views.toLocaleString()} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Authors */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">✍️ Top Authors</h3>
        <div className="space-y-3">
          {data.topAuthors.slice(0, 10).map((author, index) => (
            <div key={author._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-purple-600">#{index + 1}</span>
                <span className="font-medium text-gray-800">{author.username}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-600">{author.blogCount} blogs</span>
                <span className="text-green-600">{author.totalViews.toLocaleString()} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;