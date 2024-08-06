import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Form.css'; // Import the unified CSS

const AnswerForm = ({ submissionId, onSuccess }) => {
  const { role, userId } = useAuth();
  const [answer, setAnswer] = useState('');
  const [budget, setBudget] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (role !== 'tutor' && role !== 'admin') {
    return <p className="error-message">You do not have permission to answer this question.</p>;
  }

  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setErrors('User ID is not available. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('answer', answer);
    formData.append('budget', budget);
    formData.append('submissionId', submissionId);
    formData.append('userId', userId);

    for (let i = 0; i < attachments.length; i++) {
      formData.append('attachments', attachments[i]);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/submissions/answers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage(response.data.message);
      setErrors('');
      setAnswer('');
      setBudget('');
      setAttachments([]);
      onSuccess();
    } catch (error) {
      setErrors(error.response?.data?.error || 'Error submitting the answer. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h3 className="form-header">Submit Your Answer</h3>
        <div className="form-group">
          <label className="form-label">Answer:</label>
          <textarea
            className="form-input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Budget:</label>
          <input
            type="number"
            className="form-input"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Upload Attachments:</label>
          <input
            type="file"
            className="form-input"
            multiple
            onChange={handleFileChange}
          />
        </div>
        {errors && <span className="error-message">{errors}</span>}
        {successMessage && <span className="success-message">{successMessage}</span>}
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default AnswerForm;
