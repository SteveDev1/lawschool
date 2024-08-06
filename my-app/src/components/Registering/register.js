import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './regi.css';

const Registration = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      location: '',
      role: 'user', // default role
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      phone: Yup.string()
        .matches(/^254[0-9]{7,}$/, 'Phone number must start with 254 and be at least 10 digits long')
        .required('Phone number is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
      location: Yup.string().required('Location is required'),
      role: Yup.string().required('Role is required')
    }),
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('password', values.password);
      formData.append('location', values.location);
      formData.append('role', values.role);
      if (profileImage) {
        formData.append('profileImage', profileImage); // Ensure this is a File object
      }

      try {
        console.log('Form Data to be sent:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        await axios.post('http://localhost:4000/api/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Registration Successful');
        resetForm();
        setTimeout(() => navigate('/profile'), 1000); // Redirect to profile page after registration
      } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error.message);
        if (error.response && error.response.data) {
          setErrors({ apiError: error.response.data.msg });
        } else {
          setErrors({ apiError: 'An error occurred. Please try again.' });
        }
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="login-container">
      <div className="reg-con">
        <form onSubmit={formik.handleSubmit}>
          <h2>Register</h2>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.name && formik.touched.name ? 'error' : ''}
            />
            {formik.errors.name && formik.touched.name && <span className="error-message">{formik.errors.name}</span>}
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.email && formik.touched.email ? 'error' : ''}
            />
            {formik.errors.email && formik.touched.email && <span className="error-message">{formik.errors.email}</span>}
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.phone && formik.touched.phone ? 'error' : ''}
            />
            {formik.errors.phone && formik.touched.phone && <span className="error-message">{formik.errors.phone}</span>}
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.location && formik.touched.location ? 'error' : ''}
            />
            {formik.errors.location && formik.touched.location && <span className="error-message">{formik.errors.location}</span>}
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.password && formik.touched.password ? 'error' : ''}
            />
            {formik.errors.password && formik.touched.password && <span className="error-message">{formik.errors.password}</span>}
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.confirmPassword && formik.touched.confirmPassword ? 'error' : ''}
            />
            {formik.errors.confirmPassword && formik.touched.confirmPassword && <span className="error-message">{formik.errors.confirmPassword}</span>}
          </div>
          <div>
            <label>Role:</label>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.role ? 'error' : ''}
            >
              <option value="user">User</option>
              <option value="tutor">Tutor</option>
              <option value="admin">Admin</option>
            </select>
            {formik.errors.role && <span className="error-message">{formik.errors.role}</span>}
          </div>
          <div>
            <label>Profile Image:</label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={(event) => setProfileImage(event.currentTarget.files[0])}
            />
          </div>
          {formik.errors.apiError && <span className="error-message">{formik.errors.apiError}</span>}
          <button type="submit" disabled={formik.isSubmitting}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
