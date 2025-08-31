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
          <Link to="/" className="text-2xl font-bold gradient-text">
            DevNote
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="text-primary hover:opacity-80 transition-colors font-medium">
              Home
            </Link>
            <Link to="/blogs" className="text-primary hover:opacity-80 transition-colors font-medium">
              Blogs
            </Link>
            <Link to="/contact" className="text-primary hover:opacity-80 transition-colors font-medium">
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
                <Link to="/offline-library" className="text-primary hover:opacity-80 font-medium">
                  Offline
                </Link>
                <Link to="/profile" className="text-primary hover:opacity-80 font-medium">
                  {user.username}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-yellow-500 hover:text-yellow-400 font-medium">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-primary hover:opacity-80 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-primary hover:opacity-80 transition-colors font-medium">
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