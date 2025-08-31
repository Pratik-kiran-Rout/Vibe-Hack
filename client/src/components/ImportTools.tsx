import React, { useState } from 'react';
import api from '../utils/api';

const ImportTools: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importType, setImportType] = useState<'medium' | 'devto'>('medium');

  const handleImport = async () => {
    if (!importUrl) return;
    
    setImporting(true);
    try {
      await api.post('/api/blogs/import', {
        url: importUrl,
        type: importType
      });
      alert('Import successful!');
      setImportUrl('');
    } catch (error) {
      alert('Import failed. Please check the URL.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-primary mb-4">Import Articles</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Import From
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="medium"
                checked={importType === 'medium'}
                onChange={(e) => setImportType(e.target.value as 'medium')}
                className="mr-2"
              />
              Medium
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="devto"
                checked={importType === 'devto'}
                onChange={(e) => setImportType(e.target.value as 'devto')}
                className="mr-2"
              />
              Dev.to
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Article URL or RSS Feed
          </label>
          <input
            type="url"
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            placeholder={`Enter ${importType === 'medium' ? 'Medium' : 'Dev.to'} URL or RSS feed`}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <button
          onClick={handleImport}
          disabled={importing || !importUrl}
          className="btn-primary disabled:opacity-50"
        >
          {importing ? 'Importing...' : 'Import Articles'}
        </button>
      </div>
    </div>
  );
};

export default ImportTools;