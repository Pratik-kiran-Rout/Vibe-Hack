import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Tag {
  name: string;
  count: number;
}

interface PopularTagsProps {
  onTagClick?: (tag: string) => void;
}

const PopularTags: React.FC<PopularTagsProps> = ({ onTagClick }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularTags();
  }, []);

  const fetchPopularTags = async () => {
    try {
      const response = await axios.get('/api/search/tags/popular');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching popular tags:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🏷️ Popular Tags</h3>
        <div className="animate-pulse space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🏷️ Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => onTagClick?.(tag.name)}
            className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm hover:bg-purple-200 transition-colors"
          >
            {tag.name} ({tag.count})
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;