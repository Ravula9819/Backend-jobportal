// src/components/Hero.jsx
import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="Job search"
        />
      </div>
      <div className="hero-content">
        <h1>Find Your Dream Job or Internship</h1>
        <p>Explore opportunities tailored for you. Whether you're a student or a pro, start your journey here.</p>
      </div>
    </section>
  );
};

export default Hero;
