import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OpportunitySection.css';

const OpportunitySection = () => {
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };

  return (
    <section className="opportunity">
      <h2>Jobs & Internships</h2>
      <h2>Want to Post a Job ??</h2>
      <p>Login or Register to explore available opportunities and to post your offerings.</p>
      <div className="opportunity-buttons">
        <button className="btn" onClick={() => handleRedirect('/login')}>
          Login
        </button>
        <button className="btn btn-outline" onClick={() => handleRedirect('/register')}>
          Register
        </button>
      </div>
    </section>
  );
};

export default OpportunitySection;
