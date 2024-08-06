// src/components/ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams(); // Fetching token from URL params
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'New Password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters long';
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirm Password is required';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.newPassword = 'Passwords do not match';
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length === 0) {
            try {
                const { newPassword } = formData;
                await axios.post(`http://localhost:4000/api/reset-password/${token}`, { newPassword });
                setSubmitted(true);
                alert('Password reset successful');
                // Redirect user to login or any other page after successful password reset
                // Example redirect to login:
                // history.push('/login');
            } catch (error) {
                if (error.response && error.response.data) {
                    setErrors({ apiError: error.response.data.msg });
                } else {
                    setErrors({ apiError: 'An error occurred. Please try again.' });
                }
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="reset-password-container">
            <form onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={errors.newPassword ? 'error' : ''}
                    />
                    {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? 'error' : ''}
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
                <button type="submit">Reset Password {submitted && <span className="success-tick">✓</span>}</button>
                {errors.apiError && <span className="error-message">{errors.apiError}</span>}
            </form>
            <p>Remember your password? <Link to="/login">Login here</Link></p>
        </div>
    );
};

export default ResetPassword;
