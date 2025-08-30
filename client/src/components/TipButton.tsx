import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface TipButtonProps {
  blogId: string;
  authorName: string;
}

const TipButton: React.FC<TipButtonProps> = ({ blogId, authorName }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(5);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [1, 5, 10, 25, 50];

  const handleTip = async () => {
    if (!user || amount < 1) return;

    setLoading(true);
    try {
      await axios.post(`/api/monetization/tip/${blogId}`, {
        amount,
        message
      });
      
      setShowModal(false);
      setAmount(5);
      setMessage('');
      alert(`Thank you for tipping $${amount} to ${authorName}!`);
    } catch (error) {
      console.error('Error sending tip:', error);
      alert('Failed to send tip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
        title="Tip the author"
      >
        💰 Tip
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              💰 Tip {authorName}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($)
                </label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {predefinedAmounts.map((preAmount) => (
                    <button
                      key={preAmount}
                      onClick={() => setAmount(preAmount)}
                      className={`py-2 px-3 rounded border text-sm font-medium ${
                        amount === preAmount
                          ? 'bg-yellow-500 text-white border-yellow-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      ${preAmount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={200}
                  placeholder="Leave a nice message for the author..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <p className="text-xs text-gray-500 mt-1">{message.length}/200</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-800 text-sm">
                  <span>ℹ️</span>
                  <span>Tips help support content creators and encourage quality writing.</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleTip}
                  disabled={loading || amount < 1}
                  className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Tip $${amount}`}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TipButton;