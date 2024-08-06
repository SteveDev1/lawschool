import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../../services/api'; // Ensure these API functions exist
import './UpdateForm.css'; // Import the CSS file

const UpdateForm = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate(); // For navigation after form submission

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [images, setImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(id);
        const postData = response.data;
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setCategoryId(postData.category_id);
        setAuthorId(postData.author_id);
        setImages(postData.images || []);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to fetch post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleRemoveImage = (imageUrl) => {
    setImages(images.filter(image => image !== imageUrl));
    setImagesToRemove([...imagesToRemove, imageUrl]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category_id', categoryId);
    formData.append('author_id', authorId);

    // Append new images
    for (let i = 0; i < newImages.length; i++) {
      formData.append('images', newImages[i]);
    }

    // Append images to remove
    formData.append('images_to_remove', JSON.stringify(imagesToRemove));

    try {
      await updatePost(id, formData);
      alert('Post updated successfully!');
      navigate('/'); // Navigate to the blog list page after successful update
    } catch (error) {
      setError('Failed to update post: ' + error.message);
    }
  };

  if (loading) {
    return <p>Loading post details...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="update-form">
      <h1>Update Post</h1>
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
          <label htmlFor="author_id">Author ID</label>
          <input
            type="text"
            id="author_id"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="images">New Images</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleImageChange}
          />
        </div>
        <div className="image-preview">
          <h3>Existing Images</h3>
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <img
                  src={image} // Use the full URL received from the server
                  alt={`Post image ${index + 1}`}
                />
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleRemoveImage(image)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No images available.</p>
          )}
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="primary-button">Update Post</button>
      </form>
    </div>
  );
};

export default UpdateForm;
