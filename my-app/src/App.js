import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/navbar/navs/navbar/Navbar';
import Sidebar from './components/navbar/navs/Navside/Sidebar';
import BottomNavbar from './components/navbar/navs/Navside/BottomNavbar';
import NavRoutes from './components/routes/NavRoutes';
import PageRoutes from './components/routes/PageRoutes';
import BlogRoutes from './components/routes/BlogRoutes';
import { AuthProvider } from './components/context/AuthContext';
import './App.css';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
          <main className="main-content">
            <NavRoutes />
            <BlogRoutes />
            <PageRoutes />
          </main>
          <BottomNavbar />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
