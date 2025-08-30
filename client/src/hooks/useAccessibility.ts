import { useState, useEffect } from 'react';

type FontSize = 'small' | 'medium' | 'large';

export const useAccessibility = () => {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('fontSize');
    return (saved as FontSize) || 'medium';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Font size scaling
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '20px'
    };
    
    root.style.setProperty('--font-size-base', fontSizeMap[fontSize]);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
    localStorage.setItem('highContrast', highContrast.toString());
  }, [highContrast]);

  const increaseFontSize = () => {
    if (fontSize === 'small') setFontSize('medium');
    else if (fontSize === 'medium') setFontSize('large');
  };

  const decreaseFontSize = () => {
    if (fontSize === 'large') setFontSize('medium');
    else if (fontSize === 'medium') setFontSize('small');
  };

  const resetFontSize = () => setFontSize('medium');

  const toggleHighContrast = () => setHighContrast(prev => !prev);

  return {
    fontSize,
    highContrast,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast
  };
};