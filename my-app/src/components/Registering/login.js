// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const { login, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setMessage('');
  };

  const handleForgotPassword = async () => {
    try {
      const { email } = formData;
      if (!email) {
        alert('Please enter your email');
        return;
      }

      const res = await axios.post('http://localhost:4000/api/forgot-password', { email });
      console.log('Password reset response:', res.data);
      setMessage('Password reset instructions sent to your email');
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.msg);
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/login', formData);
      if (res.data.token) {
        const { token, role, userId } = res.data;
        
        // Log the response values
        console.log('Login response:', { token, role, userId });

        localStorage.setItem('token', token);
        localStorage.setItem('role', role); // Save the role
        localStorage.setItem('userId', userId); // Save the userId

        // Log the values being set in localStorage
        console.log('LocalStorage values set:', {
          role: localStorage.getItem('role'),
          userId: localStorage.getItem('userId')
        });

        login(role, userId); // Pass userId to login function

        // Log the values used in the login function
        console.log('Login function called with:', { role, userId });

        navigate(getRedirectPath(role));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ apiError: error.response.data.msg });
      } else {
        setErrors({ apiError: 'An error occurred. Please try again.' });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  const getRedirectPath = (role) => {
    switch (role) {
      case 'admin':
        return '/admin-dashboard';
      case 'tutor':
        return '/tutor-dashboard';
      case 'user':
      default:
        return '/';
    }
  };

  return (
    <div className='reg-con'>
      <h2>Login</h2>
      {isAuthenticated ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <p>Welcome back! You are logged in.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Login</button>
          <button type="button" onClick={handleForgotPassword}>Forgot Password?</button>
          {errors.apiError && <span className="error-message">{errors.apiError}</span>}
          {message && <span className="success-message">{message}</span>}
        </form>
      )}
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;
