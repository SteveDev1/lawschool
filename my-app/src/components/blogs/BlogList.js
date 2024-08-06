import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, likePost, getCategories, getPostsByCategory, createComment, getComments } from '../../services/api';
import './blogList.css'; // Import the CSS file
import { FaEdit, FaShareAlt } from 'react-icons/fa'; // Import icons

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('2');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({});
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null); // Initialize as null
  const [showComments, setShowComments] = useState({}); // State to handle visibility of comments

  useEffect(() => {
    const fetchUserId = async () => {
      const userIdFromStorage = localStorage.getItem('userId');
      setUserId(userIdFromStorage);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        setError('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = selectedCategory
          ? await getPostsByCategory(selectedCategory)
          : await getPosts();
        setPosts(response.data);
        console.log('Fetched posts:', response.data); // Log fetched posts
      } catch (error) {
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments();
        setComments(response.data);
        console.log('Fetched comments:', response.data); // Log fetched comments
      } catch (error) {
        setError('Failed to load comments.');
      }
    };
    fetchComments();
  }, []);

  const handleLike = async (postId) => {
    try {
      const response = await likePost(postId);
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes: response.data.likes } : post
      ));
    } catch (error) {
      setError('Failed to like post.');
    }
  };

  const handleCommentChange = (e, postId) => {
    setNewComment({
      ...newComment,
      [postId]: e.target.value
    });
  };

  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    if (!userId) {
      setError('User not authenticated.');
      return;
    }
    try {
      const response = await createComment({
        post_id: postId,
        content: newComment[postId],
        user_id: userId
      });
      setComments([...comments, response.data]);
      setNewComment({
        ...newComment,
        [postId]: ''
      });
    } catch (error) {
      setError('Failed to submit comment.');
    }
  };

  const handleShare = (postId) => {
    const url = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(url)
      .then(() => alert('Post link copied to clipboard!'))
      .catch(err => console.error('Failed to copy post link:', err));
  };

  const toggleComments = (postId) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId]
    });
  };

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="blog-list-container">
      <h1>Blog Posts</h1>
      <div>
        <h2>Filter by Category</h2>
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post">
            <div className="post-header">
              <img
                src={post.author_profile_image || '/default-avatar.png'} // Fallback to a default image
                alt={`${post.author_name}'s avatar`}
                className="author-image"
              />
              <h2>{post.title}</h2>
              <Link to={`/edit/${post.id}`} className="edit-icon">
                <FaEdit />
              </Link>
            </div>
            <p><strong>Author:</strong> {post.author_name}</p>
            <p><strong>Posted on:</strong> {new Date(post.created_at).toLocaleDateString()}</p>
            <p>{post.content}</p>
            <div className="images">
              {post.images && post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="post-image"
                />
              ))}
            </div>
            <div className="actions">
              <button className="like-button" onClick={() => handleLike(post.id)}>👍</button>
              <button className="share-button" onClick={() => handleShare(post.id)}>
                <FaShareAlt />
              </button>
              <button className="comment-button" onClick={() => toggleComments(post.id)}>
                {showComments[post.id] ? 'Hide Comments' : 'Show Comments'}
              </button>
              <p>{post.likes} likes</p>
            </div>
            {showComments[post.id] && (
              <div className="comments-section">
                <h3>Comments</h3>
                <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="comment-form">
                  <textarea
                    value={newComment[post.id] || ''}
                    onChange={(e) => handleCommentChange(e, post.id)}
                    placeholder="Write a comment..."
                    required
                  />
                  <button type="submit" className="primary-button">Submit</button>
                </form>
                <ul>
                  {comments.filter(comment => comment.post_id === post.id).map(comment => (
                    <li key={comment.id} className="comment-item">
                      <img
                        src={comment.author_profile_image || '/default-avatar.png'} // Fallback to a default image
                        alt={`${comment.author_name}'s avatar`}
                        className="commenter-image"
                      />
                      <div className="comment-content">
                        <p className="comment-author">{comment.author_name || 'Anonymous'}</p>
                        <p>{comment.content}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default BlogList;
