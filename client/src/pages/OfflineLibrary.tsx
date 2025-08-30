import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { offlineStorage } from '../utils/offlineStorage';

interface OfflineArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  savedAt?: number;
}

const OfflineLibrary: React.FC = () => {
  const [articles, setArticles] = useState<OfflineArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOfflineArticles();
  }, []);

  const loadOfflineArticles = async () => {
    try {
      const savedArticles = await offlineStorage.getAllArticles();
      setArticles(savedArticles.sort((a, b) => b.savedAt - a.savedAt));
    } catch (error) {
      console.error('Error loading offline articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeArticle = async (id: string) => {
    try {
      await offlineStorage.removeArticle(id);
      setArticles(prev => prev.filter(article => article.id !== id));
    } catch (error) {
      console.error('Error removing article:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6 text-primary">Offline Library</h1>
          
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-xl font-semibold mb-2 text-primary">No offline articles</h3>
              <p className="mb-4 text-secondary">Save articles for offline reading to access them without internet connection.</p>
              <Link to="/blogs" className="btn-primary">
                Browse Articles
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-primary">
                        <Link to={`/post/${article.id}`} className="hover:text-purple-400 transition-colors">
                          {article.title}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-4 text-sm mb-2 text-secondary">
                        <span>By {article.author}</span>
                        <span>•</span>
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Saved {new Date(article.savedAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm line-clamp-2 text-secondary">
                        {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    </div>
                    <button
                      onClick={() => removeArticle(article.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from offline library"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineLibrary;