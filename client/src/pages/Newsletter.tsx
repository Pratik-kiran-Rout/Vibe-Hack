import React from 'react';

const Newsletter: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="card text-center">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Newsletter</h1>
          <p className="text-gray-600 mb-8">
            Stay updated with the latest blogs, tech news, and community highlights.
          </p>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-4">Subscribe to our newsletter</h3>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-green-600 mt-4">
              Get weekly updates on new blogs, featured content, and community news.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;