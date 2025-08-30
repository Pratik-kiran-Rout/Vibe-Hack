import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
<<<<<<< HEAD
import { Bold, Italic, Underline, List, ListOrdered, Link, Image, Eye, Save, Upload } from 'lucide-react';
=======
import MarkdownEditor from '../components/MarkdownEditor';
>>>>>>> afd94a12ac38dd8fbef39f99445413c2773b50fe

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    excerpt: '',
    coverImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [autoSaved, setAutoSaved] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'content') {
      setWordCount(value.trim().split(/\s+/).filter(word => word.length > 0).length);
    }
  };

  const insertFormatting = (format) => {
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText || 'underlined text'}</u>`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || 'list item'}`;
        break;
      case 'orderedList':
        formattedText = `\n1. ${selectedText || 'numbered item'}`;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](url)`;
        break;
      case 'image':
        formattedText = `![${selectedText || 'alt text'}](image-url)`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));
    setWordCount(newContent.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, coverImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const autoSave = () => {
    localStorage.setItem('blogDraft', JSON.stringify(formData));
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 2000);
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem('blogDraft');
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setFormData(draft);
      setWordCount(draft.content.trim().split(/\s+/).filter(word => word.length > 0).length);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.title || formData.content) {
        autoSave();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await axios.post('http://localhost:5000/api/blogs', {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        coverImage: formData.coverImage,
        tags: tagsArray
      });

      localStorage.removeItem('blogDraft');
      toast.success('Blog created successfully! It will be reviewed by admin.');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  if (preview) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Preview</h2>
            <button
              onClick={() => setPreview(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Eye size={16} />
              <span>Edit</span>
            </button>
          </div>
          
          {formData.coverImage && (
            <img src={formData.coverImage} alt="Cover" className="w-full h-64 object-cover rounded-lg mb-6" />
          )}
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title || 'Untitled'}</h1>
          
          {formData.excerpt && (
            <p className="text-xl text-gray-600 mb-6 italic">{formData.excerpt}</p>
          )}
          
          <div className="prose max-w-none">
            {formData.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          {formData.tags && (
            <div className="mt-8 flex flex-wrap gap-2">
              {formData.tags.split(',').map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gradient">
            ✍️ Create New Blog Post
          </h2>
          <div className="flex items-center space-x-4">
            {autoSaved && <span className="text-sm text-green-600">✓ Auto-saved</span>}
            <button
              onClick={autoSave}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-primary-600"
            >
              <Save size={16} />
              <span>Save Draft</span>
            </button>
            <button
              onClick={() => setPreview(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Eye size={16} />
              <span>Preview</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full text-3xl font-bold border-none outline-none placeholder-gray-400 focus:ring-0"
                  placeholder="Enter your blog title..."
                />
              </div>

              <div>
                <input
                  type="text"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="w-full text-lg text-gray-600 border-none outline-none placeholder-gray-400 focus:ring-0"
                  placeholder="Write a brief excerpt (optional)..."
                />
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <button type="button" onClick={() => insertFormatting('bold')} className="p-2 hover:bg-white rounded">
                    <Bold size={16} />
                  </button>
                  <button type="button" onClick={() => insertFormatting('italic')} className="p-2 hover:bg-white rounded">
                    <Italic size={16} />
                  </button>
                  <button type="button" onClick={() => insertFormatting('underline')} className="p-2 hover:bg-white rounded">
                    <Underline size={16} />
                  </button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button type="button" onClick={() => insertFormatting('list')} className="p-2 hover:bg-white rounded">
                    <List size={16} />
                  </button>
                  <button type="button" onClick={() => insertFormatting('orderedList')} className="p-2 hover:bg-white rounded">
                    <ListOrdered size={16} />
                  </button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button type="button" onClick={() => insertFormatting('link')} className="p-2 hover:bg-white rounded">
                    <Link size={16} />
                  </button>
                  <button type="button" onClick={() => insertFormatting('image')} className="p-2 hover:bg-white rounded">
                    <Image size={16} />
                  </button>
                </div>
                
                <textarea
                  ref={contentRef}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="20"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Start writing your blog content here...\n\nTip: Use the formatting buttons above or markdown syntax:\n**bold** *italic* [link](url) ![image](url)"
                />
                
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>{wordCount} words</span>
                  <span>Auto-saves every 30 seconds</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Cover Image</h3>
                {formData.coverImage ? (
                  <div className="space-y-3">
                    <img src={formData.coverImage} alt="Cover" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 cursor-pointer">
                      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-sm text-gray-600">Click to upload cover image</p>
                    </div>
                  </label>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="javascript, react, tutorial"
                />
                <p className="text-xs text-gray-500 mt-2">Separate tags with commas</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>📝 Note:</strong> Your blog will be reviewed by admin before publishing.
                </p>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className="flex items-center justify-between pt-6 border-t">
=======
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Write your blog content here... Markdown is supported!"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g. javascript, react, web development"
            />
          </div>

          <div className="flex items-center justify-between">
>>>>>>> afd94a12ac38dd8fbef39f99445413c2773b50fe
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.content}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Publishing...</span>
                </>
              ) : (
                <span>🚀 Publish Blog</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;