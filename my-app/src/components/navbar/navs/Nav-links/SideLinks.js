import React from 'react';
import { Link } from 'react-router-dom';


const SideLinks = () => {
  return (
    <div className="side-links">
      <Link to="/" className="link">Home</Link>
      <Link to ='submission' className='link'>Submission</Link>
      <Link to="/questions" className="link">Questions</Link>
      <Link to="/login" className="link">Login</Link>
      <Link to="/register" className="link">Register</Link>
      <Link to="/profile" className="link">Profile</Link>
      <Link to="/visit" className="link">Blog-Home</Link>
      <Link to="/blog" className="link">Blogging</Link>
      <Link to="/create-post" className="link">Create-blog</Link>
      <Link to="/update-post" className="link">update-blog</Link>
    </div>
  );
};

export default SideLinks;
