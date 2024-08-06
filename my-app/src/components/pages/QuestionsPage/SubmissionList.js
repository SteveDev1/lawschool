import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AnswerForm from './AnswerForm';
import './Form.css'; // Import the unified CSS

const SubmissionList = () => {
  const { role, userId } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/submissions');
        setSubmissions(response.data);
      } catch (err) {
        setError('Error fetching submissions.');
      }
    };

    fetchSubmissions();
  }, []);

  const parseAttachments = (attachments) => {
    if (!attachments) return [];
    if (typeof attachments === 'string') {
      try {
        return JSON.parse(attachments);
      } catch (error) {
        console.error('Error parsing attachments:', error);
        return [];
      }
    } else if (Array.isArray(attachments)) {
      return attachments;
    }
    return [];
  };

  return (
    <div className="form-container">
      <h2 className="form-header">Submission List</h2>
      {error && <span className="error-message">{error}</span>}
      <div className="button-group">
        <button onClick={() => setSubmissions([])} className="highlight-button">All</button>
        <button onClick={() => setSubmissions(submissions.filter(sub => sub.type === 'question'))} className="highlight-button">Questions</button>
        <button onClick={() => setSubmissions(submissions.filter(sub => sub.type === 'assignment'))} className="highlight-button">Assignments</button>
        <button onClick={() => setSubmissions(submissions.filter(sub => sub.type === 'project'))} className="highlight-button">Projects</button>
      </div>
      <ul className="submission-list">
        {submissions.map((submission) => (
          <li key={submission.id} className="submission-item">
            <h3 className="submission-title">{submission.question || 'No title'}</h3>
            <p><strong>Type:</strong> {submission.type}</p>
            <p><strong>Minimum Words:</strong> {submission.minWords}</p>
            <p><strong>Is Urgent:</strong> {submission.isUrgent ? 'Yes' : 'No'}</p>
            <p><strong>Budget:</strong> ${submission.budget}</p>
            <p><strong>Category:</strong> {submission.category}</p>
            {submission.attachments && submission.attachments.length > 0 && (
              <div>
                <strong>Attachments:</strong>
                <ul className="attachment-list">
                  {parseAttachments(submission.attachments).map((file, index) => (
                    <li key={index}>
                      <a href={`http://localhost:4000/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                        {file}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {role === 'tutor' || role === 'admin' ? (
              <>
                <button onClick={() => setShowAnswerForm(submission.id)} className="accent-button">Answer</button>
                {showAnswerForm === submission.id && (
                  <AnswerForm submissionId={submission.id} onSuccess={() => setShowAnswerForm(null)} />
                )}
              </>
            ) : (
              <p><strong>Answer:</strong> {submission.paymentStatus === 'completed' ? submission.answer || 'No answer yet' : 'Payment required to view the answer'}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmissionList;
