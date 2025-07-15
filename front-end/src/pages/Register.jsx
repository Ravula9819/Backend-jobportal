import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = ({ setIsLoggedIn }) => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    education: '',
    skills: '',
    experience: '',
    resume: null,
  });







  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };


 const handleSubmit = (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords don't match");
    return;
  }

  fetch('https://job-portal-production-6a86.up.railway.app/api/auth/register',  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      education: formData.education,
      skills: formData.skills,
      experience: formData.experience
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Registered successfully!');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        setIsLoggedIn(true);
        navigate('/dashboard');
      } else {
        alert(data.message);
      }
    })
    .catch(err => {
      console.error("Register Error:", err);
      alert("Something went wrong. Try again.");
    });
};


  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <button className="close-btn" onClick={() => navigate('/')}>×</button>
        <h2>Create an Account</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <textarea
          name="education"
          placeholder="Education (e.g., B.Tech in CSE, 2024)"
          value={formData.education}
          onChange={handleChange}
          rows="3"
          required
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma-separated)"
          value={formData.skills}
          onChange={handleChange}
          required
        />

        <textarea
          name="experience"
          placeholder="Experience (optional)"
          value={formData.experience}
          onChange={handleChange}
          rows="3"
        />

        <label className="file-label">
          Upload Resume (pdf/doc)
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
