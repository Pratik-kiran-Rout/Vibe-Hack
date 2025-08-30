import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface FollowButtonProps {
  userId: string;
  username: string;
  initialFollowing?: boolean;
  initialFollowersCount?: number;
  onFollowChange?: (following: boolean, count: number) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ 
  userId, 
  username, 
  initialFollowing = false,
  initialFollowersCount = 0,
  onFollowChange 
}) => {
  const { user } = useAuth();
  const [following, setFollowing] = useState(initialFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (!user || loading) return;

    setLoading(true);
    try {
      const response = await axios.post(`/api/social/follow/${userId}`);
      setFollowing(response.data.following);
      setFollowersCount(response.data.followersCount);
      
      if (onFollowChange) {
        onFollowChange(response.data.following, response.data.followersCount);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.id === userId) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 ${
          following
            ? 'follow-btn-following'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {loading ? '...' : following ? 'Following' : 'Follow'}
      </button>
      
      {followersCount > 0 && (
        <span className="text-sm text-muted">
          {followersCount} follower{followersCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

export default FollowButton;