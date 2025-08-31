import React, { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface ReadingListButtonProps {
  blogId: string;
  initialSaved?: boolean;
  onSaveChange?: (saved: boolean) => void;
}

const ReadingListButton: React.FC<ReadingListButtonProps> = ({ 
  blogId, 
  initialSaved = false,
  onSaveChange 
}) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleToggleSave = async () => {
    if (!user || loading) return;

    setLoading(true);
    try {
      const response = await api.post(`/api/social/reading-list/${blogId}`);
      setSaved(response.data.saved);
      
      if (onSaveChange) {
        onSaveChange(response.data.saved);
      }
    } catch (error) {
      console.error('Save action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <button
      onClick={handleToggleSave}
      disabled={loading}
      className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
        saved
          ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
      title={saved ? 'Remove from reading list' : 'Add to reading list'}
    >
      {loading ? '⏳' : saved ? '🔖' : '📖'}
    </button>
  );
};

export default ReadingListButton;