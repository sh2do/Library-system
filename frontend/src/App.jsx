import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';

function App() {
  return (
    <BrowserRouter>
      {/* Background ambient light effects */}
      <div className="ambient-light-1" />
      <div className="ambient-light-2" />
      
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            {/* Private Routes would normally be wrapped in a AuthGuard component */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
