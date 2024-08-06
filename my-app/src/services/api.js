import axios from 'axios';

const API_URL = 'http://localhost:4000/api/blog';

// Fetch all posts
export const getPosts = () => axios.get(`${API_URL}/posts`);

// Fetch a single post by ID
export const getPostById = (id) => axios.get(`${API_URL}/posts/${id}`);

// Update a post by ID
export const updatePost = (id, formData) => axios.put(`${API_URL}/posts/${id}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Fetch all categories
export const getCategories = () => axios.get(`${API_URL}/categories`);

// Fetch recent posts
export const getRecentPosts = () => axios.get(`${API_URL}/recent-posts`);

// Fetch popular posts
export const getPopularPosts = () => axios.get(`${API_URL}/popular-posts`);

// Fetch posts by category
export const getPostsByCategory = (categoryId) => axios.get(`${API_URL}/posts?category_id=${categoryId}`);

// Like a post by ID
export const likePost = (id) => axios.post(`${API_URL}/posts/${id}/like`);

// Fetch comments for a post
export const getComments = () => axios.get(`${API_URL}/comments`);

// Create a new comment
export const createComment = (commentData) => axios.post(`${API_URL}/comments`, commentData);
