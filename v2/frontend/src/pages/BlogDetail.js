import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Eye, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

const BlogDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      setBlog(res.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs/${id}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like this blog');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/blogs/${id}/like`);
      setBlog(prev => ({ ...prev, likesCount: res.data.likes }));
      setLiked(!liked);
    } catch (error) {
      toast.error('Failed to like blog');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/blogs/${id}/comments`, {
        content: newComment
      });
      setComments([res.data, ...comments]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Blog not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-md p-8 mb-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-gray-600 mb-6">
            <div className="flex items-center space-x-2">
              <User size={20} />
              <span>{blog.author?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-gray-600">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 hover:text-red-500 ${liked ? 'text-red-500' : ''}`}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              <span>{blog.likesCount || 0}</span>
            </button>
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <span>{comments.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye size={20} />
              <span>{blog.views || 0}</span>
            </div>
          </div>
        </header>

        <div className="prose max-w-none mb-8">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex items-center space-x-2 mb-8">
            <span className="text-gray-600">Tags:</span>
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h3>

        {isAuthenticated && (
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Post Comment
            </button>
          </form>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-2 mb-2">
                <User size={16} className="text-gray-400" />
                <span className="font-medium text-gray-900">{comment.author?.name}</span>
                <span className="text-gray-500 text-sm">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
          
          {comments.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;