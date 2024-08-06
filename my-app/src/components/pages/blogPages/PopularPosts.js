// src/components/PopularPosts.js
import React, { useEffect, useState } from 'react';
import { getPopularPosts } from '../../../services/api'; // Ensure this API function is correctly imported// Create and style as needed

const PopularPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await getPopularPosts();
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching popular posts:', error);
        setError('Failed to load popular posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  if (loading) {
    return <p>Loading popular posts...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="popular-posts-container">
      <h2>Popular Posts</h2>
      {posts.length === 0 ? (
        <p>No popular posts available.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
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
          </div>
        ))
      )}
    </div>
  );
};

export default PopularPosts;
