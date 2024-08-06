import React from 'react';
import NavLinks from '../Nav-links/NavLinks';
import NavDropdown from '../Nav-Dropdown/SignUpDropdown';
import './Nav.css';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="top-nav">
      <div className="top-nav-content">
        <h1 className="title">My App</h1>
        <NavLinks />
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        <button className="sidebar-toggler" onClick={toggleSidebar}>
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
