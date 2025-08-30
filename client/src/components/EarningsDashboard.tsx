import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Earnings {
  totalEarnings: number;
  withdrawable: number;
  thisMonth: number;
  topTippedPosts: Array<{
    title: string;
    tips: number;
    tipCount: number;
  }>;
}

const EarningsDashboard: React.FC = () => {
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await axios.get('/api/monetization/earnings');
      setEarnings(response.data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
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
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!earnings) return null;

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Earnings Overview</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${earnings.totalEarnings.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${earnings.withdrawable.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Available to Withdraw</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">${earnings.thisMonth.toFixed(2)}</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="btn-primary">
            💳 Withdraw Earnings
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Minimum withdrawal amount: $10. Processing takes 3-5 business days.
          </p>
        </div>
      </div>

      {/* Top Tipped Posts */}
      {earnings.topTippedPosts.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Top Tipped Posts</h3>
          <div className="space-y-3">
            {earnings.topTippedPosts.map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-purple-600">#{index + 1}</span>
                  <div>
                    <h4 className="font-medium text-gray-800 line-clamp-1">{post.title}</h4>
                    <div className="text-sm text-gray-500">{post.tipCount} tips</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-green-600">
                  ${post.tips.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monetization Tips */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Monetization Tips</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-3">
            <span className="text-blue-500">•</span>
            <span>Write high-quality, engaging content to attract more tips</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-500">•</span>
            <span>Engage with your audience through comments and social media</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-500">•</span>
            <span>Consider upgrading to Pro for sponsored post opportunities</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-500">•</span>
            <span>Publish consistently to build a loyal readership</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsDashboard;