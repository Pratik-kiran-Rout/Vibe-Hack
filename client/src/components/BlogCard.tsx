import React from 'react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    excerpt: string;
    author: {
      username: string;
      avatar?: string;
    };
    createdAt: string;
    views: number;
    likes: any[];
    readTime: number;
    tags?: string[];
  };
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <div className="card hover:transform hover:scale-105 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">
        <Link to={`/post/${blog._id}`} className="hover:text-purple-600">
          {blog.title}
        </Link>
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
      
      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>By {blog.author.username}</span>
        <span>{blog.readTime} min read</span>
      </div>
      <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        <div className="flex items-center gap-4">
          <span>👁 {blog.views}</span>
          <span>❤️ {blog.likes.length}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;