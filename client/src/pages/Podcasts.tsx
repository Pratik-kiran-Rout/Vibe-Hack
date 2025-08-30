import React from 'react';

const Podcasts: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="card text-center">
          <div className="text-6xl mb-6">🎧</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Podcasts</h1>
          <p className="text-gray-600 mb-8">
            Coming soon! We're working on bringing you amazing tech podcasts and interviews.
          </p>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">What to expect:</h3>
            <ul className="text-blue-700 space-y-2">
              <li>• Developer interviews and stories</li>
              <li>• Tech industry insights</li>
              <li>• Coding tutorials and tips</li>
              <li>• Career advice and guidance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podcasts;