import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/workspaces" className="navbar-brand">
          Task Manager
        </Link>
        <div className="navbar-menu">
          <Link to="/workspaces" className="navbar-link">
            Workspaces
          </Link>
          <div className="navbar-user">
            <span className="user-name">{user.username}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
