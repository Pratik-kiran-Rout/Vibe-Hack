import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface Webhook {
  _id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

const WebhookManager: React.FC = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  const availableEvents = [
    'blog.created',
    'blog.published',
    'blog.updated',
    'blog.deleted',
    'user.registered',
    'comment.created'
  ];

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const response = await api.get('/api/webhooks');
      setWebhooks(response.data);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    }
  };

  const createWebhook = async () => {
    if (!newWebhook.url || newWebhook.events.length === 0) return;
    
    setLoading(true);
    try {
      await api.post('/api/webhooks', newWebhook);
      setNewWebhook({ url: '', events: [] });
      fetchWebhooks();
    } catch (error) {
      alert('Failed to create webhook');
    } finally {
      setLoading(false);
    }
  };

  const toggleWebhook = async (id: string, active: boolean) => {
    try {
      await api.patch(`/api/webhooks/${id}`, { active });
      fetchWebhooks();
    } catch (error) {
      alert('Failed to update webhook');
    }
  };

  const deleteWebhook = async (id: string) => {
    if (!confirm('Delete this webhook?')) return;
    
    try {
      await api.delete(`/api/webhooks/${id}`);
      fetchWebhooks();
    } catch (error) {
      alert('Failed to delete webhook');
    }
  };

  const handleEventChange = (event: string, checked: boolean) => {
    setNewWebhook(prev => ({
      ...prev,
      events: checked 
        ? [...prev.events, event]
        : prev.events.filter(e => e !== event)
    }));
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-primary mb-4">Webhook Management</h3>
      
      {/* Create New Webhook */}
      <div className="mb-6 p-4 border rounded-lg" style={{borderColor: 'var(--border-color)'}}>
        <h4 className="font-medium text-primary mb-3">Add New Webhook</h4>
        
        <div className="space-y-3">
          <input
            type="url"
            value={newWebhook.url}
            onChange={(e) => setNewWebhook(prev => ({...prev, url: e.target.value}))}
            placeholder="https://your-app.com/webhook"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Events</label>
            <div className="grid grid-cols-2 gap-2">
              {availableEvents.map(event => (
                <label key={event} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={newWebhook.events.includes(event)}
                    onChange={(e) => handleEventChange(event, e.target.checked)}
                    className="mr-2"
                  />
                  {event}
                </label>
              ))}
            </div>
          </div>
          
          <button
            onClick={createWebhook}
            disabled={loading || !newWebhook.url || newWebhook.events.length === 0}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Webhook'}
          </button>
        </div>
      </div>

      {/* Existing Webhooks */}
      <div className="space-y-3">
        <h4 className="font-medium text-primary">Existing Webhooks</h4>
        {webhooks.length === 0 ? (
          <p className="text-secondary">No webhooks configured</p>
        ) : (
          webhooks.map(webhook => (
            <div key={webhook._id} className="p-3 border rounded-lg" style={{borderColor: 'var(--border-color)'}}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-mono text-sm text-primary">{webhook.url}</div>
                  <div className="text-xs text-secondary mt-1">
                    Events: {webhook.events.join(', ')}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    Created: {new Date(webhook.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWebhook(webhook._id, !webhook.active)}
                    className={`px-2 py-1 text-xs rounded ${
                      webhook.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {webhook.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => deleteWebhook(webhook._id)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WebhookManager;