import React from 'react';
import { Link } from 'react-router-dom';
import { Library, Search, BookMarked } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container container">
      <div className="hero-section text-center">
        <div className="badge glass-panel">
          ✨ The Future of Reading is Here
        </div>
        <h1 className="hero-title">
          Explore the Infinite <span className="text-gradient">Cosmos of Knowledge</span>
        </h1>
        <p className="hero-subtitle">
          Instantly search, borrow, and read thousands of classics from your digital sanctuary. 
          Powered by ultra-fast APIs and intelligent recommendations.
        </p>
        <div className="hero-actions">
          <Link to="/catalog" className="btn btn-primary btn-lg">
            <Search size={20} /> Browse Catalog
          </Link>
          <Link to="/dashboard" className="btn btn-outline btn-lg">
            <BookMarked size={20} /> My Loans
          </Link>
        </div>
      </div>

      <div className="features-grid">
        <div className="glass-panel feature-card">
          <Library className="feature-icon" size={32} />
          <h3>Vast Collection</h3>
          <p>Access thousands of curated books across all genres instantly.</p>
        </div>
        <div className="glass-panel feature-card">
          <BookMarked className="feature-icon" size={32} />
          <h3>Smart Management</h3>
          <p>Easily track your current loans, due dates, and reading history.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
