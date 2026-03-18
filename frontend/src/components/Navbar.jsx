import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="glass-panel navbar">
      <div className="container nav-content">
        <Link to="/" className="brand">
          <BookOpen className="brand-icon" size={28} />
          <span className="brand-text">Aurora Library</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/catalog" className="nav-link">Catalog</Link>
          
          {token ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              {user.role === 'admin' && (
                <span className="badge-admin">Admin</span>
              )}
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              <User size={16} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
