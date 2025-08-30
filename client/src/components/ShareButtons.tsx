import React from 'react';
import axios from 'axios';

interface ShareButtonsProps {
  blogId: string;
  title: string;
  url: string;
  shares: number;
  onShare: (newCount: number) => void;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ blogId, title, url, shares, onShare }) => {
  const handleShare = async (platform: string) => {
    try {
      const response = await axios.post(`/api/social/share/${blogId}`);
      onShare(response.data.shares);
    } catch (error) {
      console.error('Share tracking failed:', error);
    }

    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      reddit: `https://reddit.com/submit?title=${encodedTitle}&url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">Share:</span>
      
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
        title="Share on Twitter"
      >
        🐦
      </button>
      
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        title="Share on Facebook"
      >
        📘
      </button>
      
      <button
        onClick={() => handleShare('linkedin')}
        className="p-2 text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
        title="Share on LinkedIn"
      >
        💼
      </button>
      
      <button
        onClick={() => handleShare('reddit')}
        className="p-2 text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
        title="Share on Reddit"
      >
        🔗
      </button>
      
      <button
        onClick={() => handleShare('whatsapp')}
        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
        title="Share on WhatsApp"
      >
        💬
      </button>
      
      <button
        onClick={copyToClipboard}
        className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
        title="Copy link"
      >
        📋
      </button>
      
      {shares > 0 && (
        <span className="text-sm text-gray-500 ml-2">
          {shares} share{shares !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

export default ShareButtons;