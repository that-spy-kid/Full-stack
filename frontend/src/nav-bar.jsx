import React from 'react';
import './css/nav-bar.css';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import CreditCardsPage from './credit-card-page';
import BankPage from './banks-page';

const Navbar = () => {
  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-center">
          <ul className="nav-links">
            <li>
              <Link to="/cards">Cards</Link>
            </li>
            <li>
              <Link to="/banks">Banks</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Define routes for your pages */}
      <Routes>
       <Route path="/" element={<Navigate to="/cards" replace />} />
        <Route path="/cards" element={<CreditCardsPage />} />
        <Route path="/banks" element={<BankPage />} />
      </Routes>
    </Router>
  );
};

export default Navbar;