import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/blogPages/Home';
import Blog from '../pages/blogPages/Blog';
import Post from '../pages/blogPages/Post';
import CreatePostPage from '../pages/blogPages/CreatePostPage';
import UpdateForm from '../blogs/UpdateForm';


const BlogRoutes = () => {
  return (
    <Routes>
      <Route path="/visit" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/post/:id" element={<Post />} />
      <Route path="/create-post" element={<CreatePostPage />} />
      <Route path="/edit/:id" element={<UpdateForm />} />
    </Routes>
  );
};

export default BlogRoutes;
