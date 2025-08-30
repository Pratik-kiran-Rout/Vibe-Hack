import React, { useState, useEffect } from 'react';
import { offlineStorage } from '../utils/offlineStorage';

interface OfflineIndicatorProps {
  blogId: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  blogId,
  title,
  content,
  author,
  createdAt
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSavedStatus();
  }, [blogId]);

  const checkSavedStatus = async () => {
    try {
      const saved = await offlineStorage.isArticleSaved(blogId);
      setIsSaved(saved);
    } catch (error) {
      console.error('Error checking offline status:', error);
    }
  };

  const toggleOfflineStatus = async () => {
    setLoading(true);
    try {
      if (isSaved) {
        await offlineStorage.removeArticle(blogId);
        setIsSaved(false);
      } else {
        await offlineStorage.saveArticle({
          id: blogId,
          title,
          content,
          author,
          createdAt
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling offline status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleOfflineStatus}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
        isSaved 
          ? 'offline-btn-saved' 
          : 'offline-btn-unsaved'
      }`}
      title={isSaved ? 'Remove from offline reading' : 'Save for offline reading'}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          {isSaved ? (
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 11-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          )}
        </svg>
      )}
      {isSaved ? 'Saved offline' : 'Save offline'}
    </button>
  );
};

export default OfflineIndicator;