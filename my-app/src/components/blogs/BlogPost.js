import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, likePost, getCategories, getPostsByCategory, createComment, getComments } from '../../services/api';


const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...');
        const response = await getCategories();
        console.log('Categories fetched:', response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts...');
        const response = selectedCategory
          ? await getPostsByCategory(selectedCategory)
          : await getPosts();
        console.log('Posts fetched:', response.data);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
        console.log('Fetch operation completed.');
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log('Fetching comments...');
        const response = await getComments();
        console.log('Comments fetched:', response.data);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments.');
      }
    };

    fetchComments();
  }, []);

  const handleLike = async (postId) => {
    try {
      console.log(`Liking post with ID: ${postId}`);
      const response = await likePost(postId);
      console.log('Like response:', response.data);
      // Update the post in the state with the new like count
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes: response.data.likes } : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
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
    try {
      const response = await createComment({
        post_id: postId,
        content: newComment[postId],
        author_id: 1 // Replace with actual author ID
      });
      console.log('Comment submitted:', response.data);
      // Optionally update comments state or fetch comments again
      setNewComment({
        ...newComment,
        [postId]: '' // Clear the comment input after submission
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment.');
    }
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
            <h2>{post.title}</h2>
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
              <button className="primary-button" onClick={() => handleLike(post.id)}>Like</button>
              <p>{post.likes} likes</p>
              <Link to={`/edit/${post.id}`}>
                <button className="accent-button">Edit</button>
              </Link>
            </div>
            <div className="comments-section">
              <h3>Comments</h3>
              <form onSubmit={(e) => handleCommentSubmit(post.id, e)}>
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
                  <li key={comment.id}>
                    <p>{comment.content}</p>
                    <p><strong>Author:</strong> {comment.author_name}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BlogList;
