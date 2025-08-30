import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye, Calendar } from 'lucide-react';

const BlogCard = ({ blog }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
          <span>{blog.author?.name}</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>

        <Link to={`/blog/${blog._id}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
            {blog.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.content.substring(0, 150)}...
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Heart size={16} />
              <span>{blog.likesCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={16} />
              <span>{blog.commentsCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye size={16} />
              <span>{blog.views || 0}</span>
            </div>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              {blog.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;