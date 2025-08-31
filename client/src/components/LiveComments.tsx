import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface Comment {
  _id: string;
  user: {
    username: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
}

interface LiveCommentsProps {
  blogId: string;
  initialComments: Comment[];
}

const LiveComments: React.FC<LiveCommentsProps> = ({ blogId, initialComments }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(`/api/blogs/${blogId}/comment`, {
        text: newComment.trim()
      });
      
      setComments(prev => [...prev, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-md text-center">
          <p className="text-gray-600">Please log in to comment</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">
                  {comment.user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800">{comment.user.username}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveComments;