import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Challenge {
  _id: string;
  title: string;
  prompt: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  participants: Array<{
    user: {
      username: string;
      avatar?: string;
    };
    submission?: string;
  }>;
  winner?: {
    username: string;
  };
  prizes: string[];
}

const WritingChallenges: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState('');
  const [userBlogs, setUserBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetchChallenges();
    if (user) {
      fetchUserBlogs();
    }
  }, [user]);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('/api/community/challenges');
      setChallenges(response.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      const response = await axios.get('/api/blogs/user/my-blogs');
      setUserBlogs(response.data.filter((blog: any) => blog.status === 'approved'));
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    }
  };

  const handleParticipate = async (challengeId: string) => {
    if (!selectedBlog) return;

    try {
      await axios.post(`/api/community/challenges/${challengeId}/participate`, {
        blogId: selectedBlog
      });
      fetchChallenges();
      setSelectedBlog('');
      alert('Successfully joined the challenge!');
    } catch (error) {
      console.error('Error participating in challenge:', error);
      alert('Failed to join challenge');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-600';
      case 'active': return 'bg-green-100 text-green-600';
      case 'completed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const isParticipating = (challenge: Challenge) => {
    return challenge.participants.some(p => p.user.username === user?.username);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">✍️ Writing Challenges</h1>
          <p className="text-white/80 text-lg">Test your skills with monthly writing prompts</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {challenges.map((challenge) => (
            <div key={challenge._id} className="card">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(challenge.status)}`}>
                  {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  {challenge.participants.length} participants
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">{challenge.title}</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-800 mb-2">📝 Prompt:</h4>
                <p className="text-gray-700 text-sm">{challenge.prompt}</p>
              </div>

              {challenge.description && (
                <p className="text-gray-600 mb-4">{challenge.description}</p>
              )}

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Start:</span>
                  <span>{new Date(challenge.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>End:</span>
                  <span>{new Date(challenge.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              {challenge.prizes.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">🏆 Prizes:</h4>
                  <ul className="text-sm text-gray-600">
                    {challenge.prizes.map((prize, index) => (
                      <li key={index}>• {prize}</li>
                    ))}
                  </ul>
                </div>
              )}

              {challenge.winner && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600">👑</span>
                    <span className="font-medium text-yellow-800">
                      Winner: {challenge.winner.username}
                    </span>
                  </div>
                </div>
              )}

              {user && challenge.status === 'active' && (
                <div className="space-y-3">
                  {isParticipating(challenge) ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <span className="text-green-600 font-medium">✅ You're participating!</span>
                    </div>
                  ) : (
                    <>
                      <select
                        value={selectedBlog}
                        onChange={(e) => setSelectedBlog(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select a blog to submit</option>
                        {userBlogs.map((blog) => (
                          <option key={blog._id} value={blog._id}>
                            {blog.title}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleParticipate(challenge._id)}
                        disabled={!selectedBlog}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Join Challenge
                      </button>
                    </>
                  )}
                </div>
              )}

              {!user && challenge.status === 'active' && (
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">Login to participate</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {challenges.length === 0 && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No challenges available</h3>
            <p className="text-gray-600">Check back soon for new writing challenges!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingChallenges;