import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreatePostForm.css'; // Import the CSS file

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [authorId, setAuthorId] = useState(null); // Initialize authorId as null

  useEffect(() => {
    // Fetch the logged-in user's ID from local storage
    const fetchUserId = () => {
      const userIdFromStorage = localStorage.getItem('userId');
      setAuthorId(userIdFromStorage);
    };

    fetchUserId();
  }, []);

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if authorId is available
    if (!authorId) {
      setError('User not authenticated.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category_id', categoryId);
    formData.append('author_id', authorId); // Use the logged-in user's ID

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/blog/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Post created successfully!');
        setTitle('');
        setContent('');
        setCategoryId('');
        setImages([]);
        setError('');
      }
    } catch (error) {
      setError('Failed to create post: ' + error.response.data.error);
    }
  };

  return (
    <div className="create-form">
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="category_id">Category ID</label>
          <input
            type="text"
            id="category_id"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="images">Images</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleImageChange}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="primary-button">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePostForm;
