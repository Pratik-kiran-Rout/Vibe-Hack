import React from 'react';

const SocialLogin: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="text-center">
        <h4 className="text-sm font-medium text-blue-800 mb-2">🚀 Quick Demo Access</h4>
        <div className="space-y-2 text-sm text-blue-700">
          <div className="bg-white px-3 py-2 rounded border">
            <strong>Admin:</strong> admin@devnote.com / admin123
          </div>
          <div className="bg-white px-3 py-2 rounded border">
            <strong>User:</strong> sarah@devnote.com / password123
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Or create your own account above!
        </p>
      </div>
    </div>
  );
};

export default SocialLogin;