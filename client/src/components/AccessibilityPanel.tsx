import React, { useState } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    fontSize,
    highContrast,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast
  } = useAccessibility();

  return (
    <>
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Accessibility panel toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors z-40"
        aria-label="Open accessibility options"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* Accessibility panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-40 w-64">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Accessibility</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close accessibility panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Font size controls */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size: {fontSize}
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize === 'small'}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={resetFontSize}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                aria-label="Reset font size"
              >
                A
              </button>
              <button
                onClick={increaseFontSize}
                disabled={fontSize === 'large'}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>
          </div>

          {/* High contrast toggle */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={toggleHighContrast}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">High Contrast</span>
            </label>
          </div>

          {/* Keyboard navigation info */}
          <div className="text-xs text-gray-500">
            <p>Use Tab to navigate, Enter to activate</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityPanel;