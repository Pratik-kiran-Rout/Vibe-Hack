import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Eye, Edit } from 'lucide-react';

const MarkdownEditor = ({ value, onChange, placeholder }) => {
  const [isPreview, setIsPreview] = useState(false);

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`flex items-center space-x-2 px-3 py-1 rounded ${
              !isPreview ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
            }`}
          >
            <Edit size={16} />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`flex items-center space-x-2 px-3 py-1 rounded ${
              isPreview ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
            }`}
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Markdown supported
        </div>
      </div>

      <div className="min-h-[400px]">
        {isPreview ? (
          <div className="p-4 prose max-w-none">
            <ReactMarkdown components={components}>
              {value || '*Nothing to preview*'}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-[400px] p-4 border-none resize-none focus:outline-none focus:ring-0"
          />
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;