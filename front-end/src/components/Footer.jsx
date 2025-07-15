import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Job Portal. All rights reserved.</p>
      <div className="footer-links">
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
        <a href="/post-job">Post a Job</a>
      </div>
    </footer>
  );
};

export default Footer;
