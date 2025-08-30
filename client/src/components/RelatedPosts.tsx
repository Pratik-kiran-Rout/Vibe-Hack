import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface RelatedBlog {
  _id: string;
  title: string;
  excerpt: string;
  author: {
    username: string;
    avatar?: string;
  };
  readTime: number;
  views: number;
  category: string;
}

interface RelatedPostsProps {
  blogId: string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ blogId }) => {
  const [relatedPosts, setRelatedPosts] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedPosts();
  }, [blogId]);

  const fetchRelatedPosts = async () => {
    try {
      const response = await axios.get(`/api/search/related/${blogId}`);
      setRelatedPosts(response.data);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Related Posts</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Related Posts</h3>
      <div className="space-y-4">
        {relatedPosts.map((post) => (
          <div key={post._id} className="border-b border-gray-100 pb-4 last:border-b-0">
            <h4 className="font-medium text-gray-800 mb-2">
              <Link to={`/post/${post._id}`} className="hover:text-purple-600">
                {post.title}
              </Link>
            </h4>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span>By {post.author.username}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>{post.readTime} min</span>
                <span>👁 {post.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;