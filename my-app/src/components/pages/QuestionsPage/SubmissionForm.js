import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './Form.css'; // Import the unified CSS

const SubmissionForm = () => {
  const [type, setType] = useState('question');
  const [question, setQuestion] = useState('');
  const [minWords, setMinWords] = useState('');
  const [budget, setBudget] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const token = localStorage.getItem('token');
    let userId = null;
    if (token) {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    }

    if (!userId) {
      setErrors('User ID is required.');
      return;
    }

    formData.append('userId', userId);
    formData.append('type', type);
    formData.append('question', question);
    formData.append('minWords', minWords);
    formData.append('budget', budget);
    formData.append('isUrgent', isUrgent ? 1 : 0);
    formData.append('category', category);

    for (let i = 0; i < attachments.length; i++) {
      formData.append('attachments', attachments[i]);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage(response.data.message);
      setErrors('');
      setType('question');
      setQuestion('');
      setMinWords('');
      setBudget('');
      setIsUrgent(false);
      setCategory('');
      setAttachments([]);
    } catch (error) {
      setErrors('Error submitting the form. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2 className="form-header">Submit Your Request</h2>
        <div className="form-group">
          <label className="form-label">Type:</label>
          <select
            className="form-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="question">Question</option>
            <option value="assignment">Assignment</option>
            <option value="project">Project</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Category:</label>
          <select
            className="form-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="law">Law</option>
            <option value="computer science">Computer Science</option>
            <option value="business">Business</option>
            <option value="engineering">Engineering</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Question:</label>
          <input
            type="text"
            className="form-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Minimum Words:</label>
          <input
            type="number"
            className="form-input"
            value={minWords}
            onChange={(e) => setMinWords(e.target.value)}
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
          <label className="form-label">Is Urgent:</label>
          <input
            type="checkbox"
            className="form-input"
            checked={isUrgent}
            onChange={() => setIsUrgent(!isUrgent)}
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

export default SubmissionForm;
