import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white">
            DevNote
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            <Link to="/" className="text-white hover:text-purple-200 transition-colors">
              Home
            </Link>
            <Link to="/blogs" className="text-white hover:text-purple-200 transition-colors">
              Blogs
            </Link>
            <Link to="/contact" className="text-white hover:text-purple-200 transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/create" className="btn-primary">
                  Write Blog
                </Link>
                <Link to="/offline-library" className="text-white hover:text-purple-200">
                  Offline
                </Link>
                <Link to="/profile" className="text-white hover:text-purple-200">
                  {user.username}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-yellow-300 hover:text-yellow-100">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-purple-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-purple-200 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;