import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('Other');
  const [featuredImage, setFeaturedImage] = useState('');
  const [seriesName, setSeriesName] = useState('');
  const [seriesPart, setSeriesPart] = useState(1);
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDraft, setIsDraft] = useState(true);
  const [autoSaving, setAutoSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const categories = [
    'Technology', 'Programming', 'Web Development', 'Mobile Development',
    'Data Science', 'AI/ML', 'DevOps', 'Design', 'Career', 'Tutorial',
    'News', 'Opinion', 'Other'
  ];

  // Auto-save functionality
  useEffect(() => {
    if (title || content) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [title, content, excerpt]);

  // Load existing blog if editing
  useEffect(() => {
    if (id) {
      loadBlog();
    }
  }, [id]);

  const loadBlog = async () => {
    try {
      // Try to get from user's blogs first (includes drafts)
      const response = await api.get(`/api/blogs/user/my-blogs`);
      const blog = response.data.find(b => b._id === id);
      
      if (!blog) {
        // If not found in user blogs, try direct API
        const directResponse = await api.get(`/api/blogs/${id}`);
        const directBlog = directResponse.data;
        setTitle(directBlog.title || '');
        setExcerpt(directBlog.excerpt || '');
        setContent(directBlog.content || '');
        setTags(directBlog.tags ? directBlog.tags.join(', ') : '');
        setCategory(directBlog.category || 'Other');
        setFeaturedImage(directBlog.featuredImage || '');
        setSeriesName(directBlog.series?.name || '');
        setSeriesPart(directBlog.series?.part || 1);
        setIsDraft(directBlog.isDraft !== false);
      } else {
        setTitle(blog.title || '');
        setExcerpt(blog.excerpt || '');
        setContent(blog.content || '');
        setTags(blog.tags ? blog.tags.join(', ') : '');
        setCategory(blog.category || 'Other');
        setFeaturedImage(blog.featuredImage || '');
        setSeriesName(blog.series?.name || '');
        setSeriesPart(blog.series?.part || 1);
        setIsDraft(blog.isDraft !== false);
      }
    } catch (error: any) {
      console.error('Load blog error:', error);
      setError(error.response?.data?.message || 'Failed to load blog');
    }
  };

  const saveDraft = async () => {
    if (!title && !content) return;
    
    setAutoSaving(true);
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const blogData = {
        title,
        excerpt,
        content,
        tags: tagsArray,
        category,
        featuredImage,
        series: seriesName ? { name: seriesName, part: seriesPart } : undefined,
        isDraft: true
      };

      if (id) {
        await api.put(`/api/blogs/${id}`, blogData);
      } else {
        const response = await api.post('/api/blogs', blogData);
        if (response.data._id) {
          window.history.replaceState(null, '', `/create/${response.data._id}`);
        }
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imageUrl = response.data.imageUrl || response.data.url || response.data.path;
      if (imageUrl) {
        setFeaturedImage(imageUrl);
        setError(''); // Clear any previous errors
      } else {
        throw new Error('No image URL returned from server');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      // Fallback: create a data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFeaturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('Image uploaded locally (server upload failed)');
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (publish && !content.trim()) {
      setError('Content is required for publishing');
      setLoading(false);
      return;
    }

    if (publish && !excerpt.trim()) {
      setError('Excerpt is required for publishing');
      setLoading(false);
      return;
    }

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const blogData = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        tags: tagsArray,
        category,
        featuredImage,
        series: seriesName ? { name: seriesName, part: seriesPart } : { name: '', part: 0 },
        isDraft: !publish
      };

      let response;
      if (id) {
        response = await api.put(`/api/blogs/${id}`, blogData);
      } else {
        response = await api.post('/api/blogs', blogData);
      }

      if (response.data) {
        navigate('/profile');
      } else {
        throw new Error('No response data received');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to save blog';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="card">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {id ? 'Edit Blog' : 'Create New Blog'}
            </h1>
            <div className="flex items-center gap-4">
              {autoSaving && <span className="text-sm text-gray-500">Auto-saving...</span>}
              <button
                onClick={() => saveDraft()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                💾 Save Draft
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter blog title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {featuredImage && (
                  <img src={featuredImage} alt="Featured" className="w-20 h-20 object-cover rounded" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={300}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Brief description of your blog"
              />
              <p className="text-sm text-gray-500 mt-1">{excerpt.length}/300 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. javascript, react, tutorial"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Series Name (optional)
                </label>
                <input
                  type="text"
                  value={seriesName}
                  onChange={(e) => setSeriesName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. React Tutorial Series"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part Number
                </label>
                <input
                  type="number"
                  value={seriesPart}
                  onChange={(e) => setSeriesPart(parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={!seriesName}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditorMode('rich')}
                    className={`px-3 py-1 text-sm rounded transition-colors ${editorMode === 'rich' ? 'bg-purple-600 text-white' : 'bg-purple-400 text-white hover:bg-purple-500'}`}
                  >
                    Rich Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('markdown')}
                    className={`px-3 py-1 text-sm rounded transition-colors ${editorMode === 'markdown' ? 'bg-purple-600 text-white' : 'bg-purple-400 text-white hover:bg-purple-500'}`}
                  >
                    Markdown
                  </button>
                </div>
              </div>
              
              {editorMode === 'rich' ? (
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      ['blockquote', 'code-block'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    placeholder="Write your blog content in Markdown..."
                  />
                  <div className="border rounded-md p-3 overflow-auto max-h-96" style={{borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)'}}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content || '*Preview will appear here...*'}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? 'Saving...' : '💾 Save as Draft'}
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading || !content || !excerpt}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publishing...' : '🚀 Publish Blog'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;