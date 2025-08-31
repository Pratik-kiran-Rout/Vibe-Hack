import React, { useState } from 'react';
import api from '../utils/api';

const ExportTools: React.FC = () => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type: 'json' | 'csv' | 'rss') => {
    setExporting(true);
    try {
      const response = await api.get(`/api/export/${type}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `devnote-export.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const generateRSSFeed = async () => {
    try {
      const response = await api.get('/api/rss/generate');
      const rssUrl = `${window.location.origin}/api/rss/feed.xml`;
      navigator.clipboard.writeText(rssUrl);
      alert(`RSS feed generated! URL copied to clipboard: ${rssUrl}`);
    } catch (error) {
      alert('Failed to generate RSS feed.');
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-primary mb-4">Export & RSS</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-primary mb-2">Export Your Data</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Export JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-primary mb-2">RSS Feed</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={generateRSSFeed}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Generate RSS Feed
            </button>
            <a
              href="/api/rss/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              View RSS Feed
            </a>
          </div>
        </div>

        <div className="text-sm text-secondary">
          <p>• JSON: Complete backup of your blogs and data</p>
          <p>• CSV: Spreadsheet-friendly format</p>
          <p>• RSS: Subscribe to your blog updates</p>
        </div>
      </div>
    </div>
  );
};

export default ExportTools;