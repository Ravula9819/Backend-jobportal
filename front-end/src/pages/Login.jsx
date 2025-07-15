// src/pages/Login.jsx
import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter all fields');
      return;
    }

    fetch('https://job-portal-production-6a86.up.railway.app/api/auth/login', 
 {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Login successful");
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', email);
          setIsLoggedIn(true); // ✅ works now
          navigate('/dashboard');
        } else {
          alert(data.message);
        }
      })
      .catch(err => {
        console.error("Login Error:", err);
        alert("Something went wrong. Try again.");
      });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <button className="close-btn" onClick={() => navigate('/')}>×</button>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        <p>
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
