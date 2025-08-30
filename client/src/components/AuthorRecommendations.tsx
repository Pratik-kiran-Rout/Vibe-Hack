import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FollowButton from './FollowButton';
import { useAuth } from '../context/AuthContext';

interface Author {
  _id: string;
  username: string;
  bio: string;
  avatar?: string;
  followersCount: number;
  blogsCount: number;
}

const AuthorRecommendations: React.FC = () => {
  const { user } = useAuth();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecommendedAuthors();
    }
  }, [user]);

  const fetchRecommendedAuthors = async () => {
    try {
      const response = await axios.get('/api/search/authors/recommended');
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching recommended authors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return null;
  }

  if (authors.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">👥 Recommended Authors</h3>
      <div className="space-y-4">
        {authors.slice(0, 5).map((author) => (
          <div key={author._id} className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">
                  {author.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{author.username}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {author.bio || 'No bio available'}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>{author.followersCount} followers</span>
                  <span>{author.blogsCount} blogs</span>
                </div>
              </div>
            </div>
            <FollowButton
              userId={author._id}
              username={author.username}
              initialFollowersCount={author.followersCount}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorRecommendations;