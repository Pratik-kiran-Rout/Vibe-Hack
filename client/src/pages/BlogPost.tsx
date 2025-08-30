import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
    avatar?: string;
    bio?: string;
  };
  createdAt: string;
  views: number;
  likes: any[];
  comments: any[];
  readTime: number;
  tags: string[];
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${id}`);
        setBlog(response.data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Blog not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h2>
          <p className="text-gray-600">{error || 'The blog you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-4xl">
        <article className="card">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>By {blog.author.username}</span>
                <span>•</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{blog.readTime} min read</span>
              </div>
              <div className="flex items-center gap-4">
                <span>👁 {blog.views}</span>
                <span>❤️ {blog.likes.length}</span>
                <span>💬 {blog.comments.length}</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br>') }} />
          </div>

          {/* Author Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xl">
                  {blog.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{blog.author.username}</h3>
                {blog.author.bio && (
                  <p className="text-gray-600 mt-1">{blog.author.bio}</p>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;