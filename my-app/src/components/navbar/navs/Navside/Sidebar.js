import React from 'react';
import '.././navbar/Nav.css';
import SideLinks from '../Nav-links/SideLinks';

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={closeSidebar}>✖</button>
      <SideLinks />
    </div>
  );
};

export default Sidebar;
