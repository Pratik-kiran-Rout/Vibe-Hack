import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import ShareButtons from '../components/ShareButtons';
import FollowButton from '../components/FollowButton';
import ReadingListButton from '../components/ReadingListButton';
import RelatedPosts from '../components/RelatedPosts';
import ReportButton from '../components/ReportButton';
import LiveComments from '../components/LiveComments';
import TipButton from '../components/TipButton';
import ReadingProgress from '../components/ReadingProgress';
import OfflineIndicator from '../components/OfflineIndicator';
import { useAuth } from '../context/AuthContext';
import { updateMetaTags, generateStructuredData } from '../utils/seo';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
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
  category: string;
  series?: {
    name: string;
    part: number;
  };
  shares: number;
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [seriesBlogs, setSeriesBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [readStartTime, setReadStartTime] = useState<number>(Date.now());

  const handleLike = async () => {
    if (!blog || !user) {
      alert('Please login to like this blog');
      return;
    }

    try {
      const response = await api.post(`/api/blogs/${blog._id}/like`);
      setBlog(prev => prev ? {
        ...prev,
        likes: Array(response.data.likes).fill({ user: user.id })
      } : null);
    } catch (error: any) {
      console.error('Error liking blog:', error);
      if (error.response?.status === 401) {
        alert('Please login to like blogs');
      }
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/api/blogs/${id}`);
        setBlog(response.data);
        
        // Fetch series blogs if this blog is part of a series
        if (response.data.series?.name) {
          const seriesResponse = await api.get(`/api/social/series/${encodeURIComponent(response.data.series.name)}`);
          setSeriesBlogs(seriesResponse.data);
        }
        
        setReadStartTime(Date.now());
        
        // Update SEO meta tags
        updateMetaTags({
          title: response.data.title,
          description: response.data.excerpt,
          author: response.data.author.username,
          url: window.location.href,
          image: response.data.featuredImage,
          keywords: response.data.tags.join(', ')
        });
        
        // Generate structured data
        generateStructuredData({
          type: 'Article',
          title: response.data.title,
          description: response.data.excerpt,
          author: response.data.author.username,
          datePublished: response.data.createdAt,
          url: window.location.href,
          image: response.data.featuredImage
        });
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

  // Track reading history when component unmounts
  useEffect(() => {
    return () => {
      if (blog && readStartTime) {
        const readTime = Math.floor((Date.now() - readStartTime) / 1000);
        if (readTime > 10) { // Only track if read for more than 10 seconds
          // Track reading history for logged-in users
          if (user) {
            api.post(`/api/search/reading-history/${blog._id}`, { readTime })
              .catch(error => console.error('Failed to track reading history:', error));
          }
          
          // Track analytics for all users
          api.post(`/api/analytics/track-view/${blog._id}`, {
            referrer: document.referrer,
            readTime
          }).catch(error => console.error('Failed to track analytics:', error));
        }
      }
    };
  }, [user, blog, readStartTime]);

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
      <ReadingProgress />
      <div className="container mx-auto max-w-4xl">
        <article className="card">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4 text-sm mb-4 text-secondary">
              <div className="flex items-center gap-4">
                <span>By {blog.author.username}</span>
                <span>•</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{blog.readTime} min read</span>
                <span>•</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                  {blog.category}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span>👁 {blog.views}</span>
                <button 
                  onClick={handleLike}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer"
                >
                  ❤️ {blog.likes.length}
                </button>
                <span>💬 {blog.comments.length}</span>
                <ReadingListButton blogId={blog._id} />
                <OfflineIndicator 
                  blogId={blog._id}
                  title={blog.title}
                  content={blog.content}
                  author={blog.author.username}
                  createdAt={blog.createdAt}
                />
                <ReportButton blogId={blog._id} />
              </div>
            </div>

            {/* Series Info */}
            {blog.series?.name && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-purple-800 mb-2">
                  📚 Part {blog.series.part} of "{blog.series.name}" series
                </h4>
                {seriesBlogs.length > 1 && (
                  <div className="text-sm">
                    <span className="text-purple-600">Other parts: </span>
                    {seriesBlogs
                      .filter(b => b._id !== blog._id)
                      .sort((a, b) => a.series.part - b.series.part)
                      .map((seriesBlog, index) => (
                        <span key={seriesBlog._id}>
                          {index > 0 && ', '}
                          <a href={`/post/${seriesBlog._id}`} className="text-purple-600 hover:underline">
                            Part {seriesBlog.series.part}
                          </a>
                        </span>
                      ))
                    }
                  </div>
                )}
              </div>
            )}

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

          {/* Social Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <ShareButtons 
                blogId={blog._id}
                title={blog.title}
                url={window.location.href}
                shares={blog.shares || 0}
                onShare={(newCount) => setBlog(prev => prev ? {...prev, shares: newCount} : null)}
              />
              <TipButton blogId={blog._id} authorName={blog.author.username} />
            </div>
          </div>

          {/* Author Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-xl">
                    {blog.author.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{blog.author.username}</h3>
                  {blog.author.bio && (
                    <p className="mt-1 text-secondary">{blog.author.bio}</p>
                  )}
                </div>
              </div>
              <FollowButton 
                userId={blog.author._id}
                username={blog.author.username}
              />
            </div>
          </div>
        </article>

        {/* Live Comments */}
        <LiveComments blogId={blog._id} initialComments={blog.comments} />

        {/* Related Posts */}
        <div className="mt-12">
          <RelatedPosts blogId={blog._id} />
        </div>
      </div>
    </div>
  );
};

export default BlogPost;