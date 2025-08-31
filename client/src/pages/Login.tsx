import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SocialLogin from '../components/SocialLogin';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login attempt:', { email, password: '***' });

    try {
      await login(email, password);
      console.log('Login successful');
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-surface border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-primary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-surface border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-primary"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{borderColor: 'var(--border-color)'}}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-secondary" style={{background: 'var(--bg-card)'}}>Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <SocialLogin />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-600 hover:text-purple-800 font-medium">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4" style={{background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '0.5rem'}}>
          <div className="text-center">
            <div className="text-lg mb-2" style={{color: 'var(--text-primary)'}}>🚀 <span className="font-semibold">Quick Demo Access</span></div>
            <div className="text-sm space-y-1" style={{color: 'var(--text-secondary)'}}>
              <div><strong>Admin:</strong> admin@devnote.com / admin123</div>
              <div className="text-xs mt-2" style={{color: 'var(--text-muted)'}}>Or create your own account above!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;