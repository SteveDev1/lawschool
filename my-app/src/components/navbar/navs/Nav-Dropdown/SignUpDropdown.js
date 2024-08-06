import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import '../navbar/Nav.css';

const NavDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate(); // Add navigate here

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/'); // Redirect to the login page after logout
  };

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="button">
        Signup
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <Link to="/login" className="dropdown-item">Login</Link>
          <Link to="/register" className="dropdown-item">Register</Link>
          <Link to="/profile" className="dropdown-item">Profile</Link>
          <button onClick={handleLogout} className="dropdown-item">Logout</button>
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
