import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Plan {
  name: string;
  price: number;
  features: string[];
}

interface Plans {
  free: Plan;
  premium: Plan;
  pro: Plan;
}

const PremiumPlans: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plans | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/monetization/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planKey: string) => {
    if (!user || planKey === 'free') return;

    setSubscribing(planKey);
    try {
      await axios.post('/api/monetization/subscribe', { plan: planKey });
      alert('Subscription activated successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setSubscribing('');
    }
  };

  const getCurrentPlan = () => {
    return user?.subscription?.plan || 'free';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!plans) return null;

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">💎 Premium Plans</h1>
          <p className="text-white/80 text-lg">Unlock advanced features and grow your audience</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`card relative ${
                key === 'premium' ? 'ring-2 ring-purple-500 transform scale-105' : ''
              }`}
            >
              {key === 'premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  ${plan.price}
                  {plan.price > 0 && <span className="text-lg text-gray-600">/month</span>}
                </div>
                {getCurrentPlan() === key && (
                  <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(key)}
                disabled={
                  !user || 
                  getCurrentPlan() === key || 
                  subscribing === key ||
                  key === 'free'
                }
                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                  key === 'premium'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : key === 'pro'
                    ? 'bg-gray-800 text-white hover:bg-gray-900'
                    : 'bg-gray-100 text-gray-600 cursor-not-allowed'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {!user
                  ? 'Login Required'
                  : getCurrentPlan() === key
                  ? 'Current Plan'
                  : subscribing === key
                  ? 'Processing...'
                  : key === 'free'
                  ? 'Free Forever'
                  : `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="card mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4">Premium</th>
                  <th className="text-center py-3 px-4">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Unlimited Blogs', '✓', '✓', '✓'],
                  ['Basic Analytics', '✓', '✓', '✓'],
                  ['Community Access', '✓', '✓', '✓'],
                  ['Premium Content Access', '✗', '✓', '✓'],
                  ['Advanced Analytics', '✗', '✓', '✓'],
                  ['Remove Ads', '✗', '✓', '✓'],
                  ['Custom Domain', '✗', '✗', '✓'],
                  ['Monetization Tools', '✗', '✗', '✓'],
                  ['Priority Support', '✗', '✓', '✓']
                ].map(([feature, free, premium, pro], index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-800">{feature}</td>
                    <td className="text-center py-3 px-4">
                      <span className={free === '✓' ? 'text-green-500' : 'text-red-500'}>
                        {free}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={premium === '✓' ? 'text-green-500' : 'text-red-500'}>
                        {premium}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={pro === '✓' ? 'text-green-500' : 'text-red-500'}>
                        {pro}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlans;