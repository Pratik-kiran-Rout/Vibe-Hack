import React, { useState } from 'react';
import axios from 'axios';

interface BulkActionsProps {
  selectedItems: string[];
  type: 'blogs' | 'users';
  onActionComplete: () => void;
  onClearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ 
  selectedItems, 
  type, 
  onActionComplete, 
  onClearSelection 
}) => {
  const [loading, setLoading] = useState(false);

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) return;

    const confirmMessage = `Are you sure you want to ${action} ${selectedItems.length} ${type}?`;
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const endpoint = type === 'blogs' 
        ? '/api/admin-tools/blogs/bulk-action'
        : '/api/admin-tools/users/bulk-action';
      
      const payload = type === 'blogs' 
        ? { blogIds: selectedItems, action }
        : { userIds: selectedItems, action };

      await axios.post(endpoint, payload);
      onActionComplete();
      onClearSelection();
    } catch (error) {
      console.error('Bulk action failed:', error);
      alert('Action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (selectedItems.length === 0) return null;

  const blogActions = [
    { key: 'approve', label: '✅ Approve', color: 'bg-green-600' },
    { key: 'reject', label: '❌ Reject', color: 'bg-red-600' },
    { key: 'hide', label: '👁️ Hide', color: 'bg-yellow-600' },
    { key: 'delete', label: '🗑️ Delete', color: 'bg-red-800' }
  ];

  const userActions = [
    { key: 'promote', label: '⬆️ Promote to Admin', color: 'bg-purple-600' },
    { key: 'demote', label: '⬇️ Demote to User', color: 'bg-gray-600' },
    { key: 'delete', label: '🗑️ Delete Users', color: 'bg-red-800' }
  ];

  const actions = type === 'blogs' ? blogActions : userActions;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 z-50">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {selectedItems.length} {type} selected
        </span>
        
        <div className="flex gap-2">
          {actions.map((action) => (
            <button
              key={action.key}
              onClick={() => handleBulkAction(action.key)}
              disabled={loading}
              className={`px-3 py-1 text-white text-sm rounded ${action.color} hover:opacity-90 disabled:opacity-50`}
            >
              {action.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClearSelection}
          className="px-3 py-1 text-gray-600 dark:text-gray-400 text-sm border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default BulkActions;