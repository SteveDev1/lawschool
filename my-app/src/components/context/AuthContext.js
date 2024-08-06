// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to provide auth context to children components
export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('role') || 'user');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || ''); // Initialize userId
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const login = (role, userId) => {
    setRole(role);
    setUserId(userId); // Set userId
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId); // Save userId
    setIsAuthenticated(true);
  };

  const logout = () => {
    setRole('user');
    setUserId(''); // Clear userId
    localStorage.removeItem('role');
    localStorage.removeItem('userId'); // Remove userId
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ role, userId, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
