import React, { useState, useEffect } from 'react';

const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const maxScroll = articleHeight - windowHeight;
      
      if (maxScroll > 0) {
        const progressPercent = Math.min(100, (scrolled / maxScroll) * 100);
        setProgress(progressPercent);
      }
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div 
      className="fixed top-20 left-0 right-0 h-1 z-40 bg-white/20"
      style={{ height: '4px' }}
    >
      <div
        className="h-full transition-transform duration-150 ease-out"
        style={{
          background: 'var(--gradient-hero)',
          transform: `scaleX(${progress / 100})`,
          transformOrigin: 'left'
        }}
      />
    </div>
  );
};

export default ReadingProgress;