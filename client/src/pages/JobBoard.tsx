import React from 'react';

const JobBoard: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="card text-center">
          <div className="text-6xl mb-6">💼</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Job Board</h1>
          <p className="text-gray-600 mb-8">
            Find your next opportunity or post job openings for the developer community.
          </p>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Coming Soon:</h3>
            <ul className="text-purple-700 space-y-2">
              <li>• Developer job listings</li>
              <li>• Remote work opportunities</li>
              <li>• Freelance projects</li>
              <li>• Internship programs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;