import React from 'react';
import { Link } from 'react-router-dom';
import '../navbar/Nav.css'; // Ensure the path is correct
import { FaHome, FaEnvelope, FaUser, FaShoppingCart, FaBlog } from 'react-icons/fa'; // Added FaBlog

const BottomNavbar = () => {
  return (
    <nav className="bottom-nav">
      <Link to="/email" className="bottom-nav-item">
        <FaEnvelope className="bottom-nav-icon" />
      
      </Link>
      <Link to="/" className="bottom-nav-item">
        <FaHome className="bottom-nav-icon" />
       
      </Link>
      <Link to="/blog" className="bottom-nav-item">
        <FaBlog className="bottom-nav-icon" />
       
      </Link>
      <Link to="/signup" className="bottom-nav-item">
        <FaUser className="bottom-nav-icon" />
      
      </Link>
      <Link to="/cart" className="bottom-nav-item">
        <FaShoppingCart className="bottom-nav-icon" />
      
      </Link>
    </nav>
  );
};

export default BottomNavbar;
