import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../services/api';
import './Catalog.css';

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (query = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/books${query ? `?title=${query}` : ''}`);
      setBooks(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchQuery);
  };

  const handleCheckout = async (bookId) => {
    try {
      // Due in 14 days
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      
      await api.post('/loans/', {
        book_id: bookId,
        due_date: dueDate.toISOString().split('T')[0]
      });
      alert('Checkout successful!');
      fetchBooks(searchQuery); // refresh catalog
    } catch (error) {
      alert(error.response?.data?.detail || 'Please login to checkout books.');
    }
  };

  return (
    <div className="container view-container">
      <div className="catalog-header">
        <h1>Library Catalog</h1>
        <form onSubmit={handleSearch} className="search-bar glass-panel">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search books by title..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Find</button>
        </form>
      </div>

      {loading ? (
        <div className="loader">Loading cosmos...</div>
      ) : (
        <div className="books-grid">
          {books.map(book => (
            <div key={book.id} className="book-card glass-panel">
              <div className="book-cover-placeholder">
                {book.title.charAt(0)}
              </div>
              <div className="book-details">
                <div className="badges">
                  {book.is_available ? (
                    <span className="badge badge-success">Available</span>
                  ) : (
                    <span className="badge badge-warning">Checked Out</span>
                  )}
                </div>
                <h3>{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <div className="book-footer">
                  <span className="book-year">{book.published_year}</span>
                  <button 
                    onClick={() => handleCheckout(book.id)}
                    className="btn btn-primary btn-sm"
                    disabled={!book.is_available}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
