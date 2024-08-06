import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correctly import jwt-decode
import './profile.css'; // Ensure this CSS file is updated with the new styles

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    profileImage: '' // Added for profile image
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [questions, setQuestions] = useState([]); // Combined list of asked and answered questions
  const [imagePreview, setImagePreview] = useState(''); // State for image preview
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors({ apiError: 'No token found. Please log in.' });
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:4000/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('User Details:', res.data); // Debugging line to check user details
        setFormData(res.data);
        setImagePreview(res.data.profileImage); // Set initial image preview
      } catch (error) {
        console.error('Error fetching user details:', error);
        if (error.response && error.response.status === 401) {
          setErrors({ apiError: 'Unauthorized. Please log in again.' });
          navigate('/login');
        } else {
          setErrors({ apiError: 'An error occurred. Please try again.' });
        }
      }
    };

    const fetchUserQuestionsAndAnswers = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      console.log('Decoded User ID:', userId); // Debugging line to check decoded user ID

      try {
        // Fetch questions asked by the user
        const askedRes = await axios.get(`http://localhost:4000/api/submissions/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Asked Questions:', askedRes.data); // Debugging line to check asked questions

        // Fetch answers given by the user
        const answeredRes = await axios.get(`http://localhost:4000/api/submissions/user/answers/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Answered Questions:', answeredRes.data); // Debugging line to check answered questions

        // Combine asked and answered questions
        const combinedQuestions = askedRes.data.map((question) => {
          const answer = answeredRes.data.find(
            (ans) => ans.submissionId === question.id
          );
          return {
            ...question,
            answer: answer ? answer.answer : null,
            answerBudget: answer ? answer.budget : null,
            paymentStatus: answer ? answer.paymentStatus : 'pending' // Add payment status
          };
        });
        setQuestions(combinedQuestions);
      } catch (error) {
        console.error('Error fetching user questions or answers:', error);
        setErrors({ apiError: 'An error occurred. Please try again.' });
      }
    };

    fetchUserDetails();
    fetchUserQuestionsAndAnswers();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      // Handle image file input
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setImagePreview(URL.createObjectURL(file)); // Update image preview
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setErrors({ apiError: 'No token found. Please log in.' });
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) formDataToSend.append(key, formData[key]);
    });

    try {
      await axios.put('http://localhost:4000/api/user', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // Required for file uploads
        }
      });
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ apiError: error.response.data.msg });
      } else {
        setErrors({ apiError: 'An error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-image-container">
          <img
            src={imagePreview || 'default-profile-image.png'} // Fallback image if none is selected
            alt="Profile"
            className="profile-image"
          />
          <div>
            <label htmlFor="profileImage">Profile Image:</label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password (leave blank to keep current password):</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {errors.apiError && <span className="error-message">{errors.apiError}</span>}
        {successMessage && <span className="success-message">{successMessage}</span>}
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      <h2>Tasks You Have Done</h2>
      {questions.length > 0 ? (
        questions.filter(q => q.answer).map((item) => (
          <div key={item.id} className="task-item">
            <p><strong>Question:</strong> {item.question}</p>
            <p><strong>Answer:</strong> {item.answer}</p>
            <p><strong>Budget:</strong> ${item.answerBudget}</p>
            <p><strong>Payment Status:</strong> {item.paymentStatus === 'completed' ? 'Paid' : 'Pending'}</p>
          </div>
        ))
      ) : (
        <p>You have not completed any tasks yet.</p>
      )}

      <h2>Your Questions</h2>
      {questions.length > 0 ? (
        questions.map((item) => (
          <div key={item.id} className="question-item">
            <p><strong>Question:</strong> {item.question}</p>
            <p><strong>Budget:</strong> ${item.budget}</p>
            {item.answer ? (
              item.paymentStatus === 'completed' ? (
                <>
                  <p><strong>Answer:</strong> {item.answer}</p>
                  <p><strong>Answer Budget:</strong> ${item.answerBudget}</p>
                </>
              ) : (
                <p><strong>Make Payment:</strong> To view the answer, please complete the payment.</p>
              )
            ) : (
              <p><strong>Answered:</strong> No</p>
            )}
          </div>
        ))
      ) : (
        <p>You have not asked any questions yet.</p>
      )}
    </div>
  );
};

export default EditProfile;
