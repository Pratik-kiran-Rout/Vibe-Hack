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
    <article className="card group cursor-pointer transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center space-x-3 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {blog.author?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span className="font-medium">{blog.author?.name}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>

        <Link to={`/blog/${blog._id}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors leading-tight">
            {blog.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {blog.content.substring(0, 150)}...
        </p>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1 hover:text-red-500 transition-colors">
              <Heart size={16} />
              <span>{blog.likesCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
              <MessageCircle size={16} />
              <span>{blog.commentsCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-green-500 transition-colors">
              <Eye size={16} />
              <span>{blog.views || 0}</span>
            </div>
          </div>
          
          <Link 
            to={`/blog/${blog._id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;