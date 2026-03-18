import React, { useState, useEffect } from 'react';
import { User, KeyRound, LayoutDashboard } from 'lucide-react';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [myLoans, setMyLoans] = useState([]);

  useEffect(() => {
    if (token) {
      fetchMyLoans();
    }
  }, [token]);

  const fetchMyLoans = async () => {
    try {
      const response = await api.get('/loans/my-loans');
      setMyLoans(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // OAuth2 Password Request requires form-data
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        const response = await api.post('/token', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        const accessToken = response.data.access_token;
        localStorage.setItem('token', accessToken);
        
        // Simple trick to extract JWT payload without library
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const userData = { email: payload.sub, role: payload.role };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(accessToken);
        setUser(userData);
      } else {
        await api.post('/users/', { name, email, password });
        setIsLogin(true); // Switch to login after successful register
        alert('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    }
  };

  const handleReturnAction = async (loanId) => {
    try {
      await api.put(`/loans/${loanId}/return`);
      alert("Book returned successfully!");
      fetchMyLoans();
    } catch (err) {
      alert(err.response?.data?.detail || 'Return failed');
    }
  };

  if (token) {
    return (
      <div className="container view-container">
        <div className="dashboard-header">
          <h1><LayoutDashboard className="inline-icon" /> Welcome, {user.email.split('@')[0]}</h1>
          <span className="role-tag">Role: {user.role}</span>
        </div>

        <div className="glass-panel dashboard-card">
          <h2>My Active Loans</h2>
          {myLoans.length === 0 ? (
            <p className="no-data">You have no active checkouts.</p>
          ) : (
            <div className="table-responsive">
              <table className="loans-table">
                <thead>
                  <tr>
                    <th>Book ID</th>
                    <th>Checkout Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myLoans.map(loan => (
                    <tr key={loan.id}>
                      <td>#{loan.book_id}</td>
                      <td>{loan.loan_date}</td>
                      <td>
                        {loan.return_date ? (
                          <span className="badge badge-success">Returned {loan.return_date}</span>
                        ) : (
                          <span className="badge badge-warning">Due {loan.due_date}</span>
                        )}
                      </td>
                      <td>
                        {!loan.return_date && (
                          <button onClick={() => handleReturnAction(loan.id)} className="btn btn-outline btn-sm">
                            Return Book
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container auth-container">
      <div className="glass-panel auth-card">
        <h2>{isLogin ? 'Access Gateway' : 'Create Identity'}</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleAuth} className="auth-form">
          {!isLogin && (
             <div className="input-group">
               <User className="input-icon" size={18} />
               <input 
                 type="text" 
                 placeholder="Full Name" 
                 className="input-field" 
                 value={name} onChange={e => setName(e.target.value)} required 
               />
             </div>
          )}
          
          <div className="input-group">
            <User className="input-icon" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="input-field" 
              value={email} onChange={e => setEmail(e.target.value)} required 
            />
          </div>
          
          <div className="input-group">
            <KeyRound className="input-icon" size={18} />
            <input 
              type="password" 
              placeholder="Secure Password" 
              className="input-field" 
              value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {isLogin ? 'Authenticate' : 'Initialize Account'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have access? " : "Already initialized? "}
          <span onClick={() => setIsLogin(!isLogin)} className="text-accent cursor-pointer">
            {isLogin ? 'Register Here' : 'Login Here'}
          </span>
        </p>

        <div className="auth-hint">
          <p>Demo Admin: admin@library.com / admin123</p>
          <p>Demo User: user@library.com / user123</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
