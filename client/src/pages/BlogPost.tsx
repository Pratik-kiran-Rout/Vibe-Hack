import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ShareButtons from '../components/ShareButtons';
import FollowButton from '../components/FollowButton';
import ReadingListButton from '../components/ReadingListButton';
import RelatedPosts from '../components/RelatedPosts';
import ReportButton from '../components/ReportButton';
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

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${id}`);
        setBlog(response.data);
        
        // Fetch series blogs if this blog is part of a series
        if (response.data.series?.name) {
          const seriesResponse = await axios.get(`/api/social/series/${encodeURIComponent(response.data.series.name)}`);
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
            axios.post(`/api/search/reading-history/${blog._id}`, { readTime })
              .catch(error => console.error('Failed to track reading history:', error));
          }
          
          // Track analytics for all users
          axios.post(`/api/analytics/track-view/${blog._id}`, {
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
      <div className="container mx-auto max-w-4xl">
        <article className="card">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-4">
                <span>By {blog.author.username}</span>
                <span>•</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{blog.readTime} min read</span>
                <span>•</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                  {blog.category}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span>👁 {blog.views}</span>
                <span>❤️ {blog.likes.length}</span>
                <span>💬 {blog.comments.length}</span>
                <ReadingListButton blogId={blog._id} />
                <ReportButton blogId={blog._id} />
              </div>
            </div>

            {/* Series Info */}
            {blog.series?.name && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  📚 Part {blog.series.part} of "{blog.series.name}" series
                </h4>
                {seriesBlogs.length > 1 && (
                  <div className="text-sm">
                    <span className="text-blue-600">Other parts: </span>
                    {seriesBlogs
                      .filter(b => b._id !== blog._id)
                      .sort((a, b) => a.series.part - b.series.part)
                      .map((seriesBlog, index) => (
                        <span key={seriesBlog._id}>
                          {index > 0 && ', '}
                          <a href={`/post/${seriesBlog._id}`} className="text-blue-600 hover:underline">
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
            <ShareButtons 
              blogId={blog._id}
              title={blog.title}
              url={window.location.href}
              shares={blog.shares || 0}
              onShare={(newCount) => setBlog(prev => prev ? {...prev, shares: newCount} : null)}
            />
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
                  <h3 className="font-semibold text-gray-800">{blog.author.username}</h3>
                  {blog.author.bio && (
                    <p className="text-gray-600 mt-1">{blog.author.bio}</p>
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

        {/* Related Posts */}
        <div className="mt-12">
          <RelatedPosts blogId={blog._id} />
        </div>
      </div>
    </div>
  );
};

export default BlogPost;