import React, { useState } from 'react';
import './PostJob.css';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const [job, setJob] = useState({
    name: '',
    position: '',
    place: '',
    salary: '',
    experience: '',
    eligibility: '',
    type: 'job', // job or internship
    openings: '',
    lastDate: '',
    skills: '',
    responsibilities: '',
    applyLink: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem('userEmail');
const jobWithEmail = { ...job, postedBy: email };

      const res = await fetch('https://job-portal-production-6a86.up.railway.app/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(jobWithEmail),
});

    

      const result = await res.json();
      if (result.success) {
        alert('Job posted successfully!');
        setJob({
          name: '',
          position: '',
          place: '',
          salary: '',
          experience: '',
          eligibility: '',
          type: 'job',
          openings: '',
          lastDate: '',
          skills: '',
          responsibilities: '',
          applyLink: ''
        });
        navigate('/');
      } else {
        alert('Error posting job.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error!');
    }
  };

  return (
    <div className="postjob-container">
      <form className="postjob-form" onSubmit={handleSubmit}>
        <button className="close-btn" onClick={() => navigate('/')}>×</button>
        <h2>Post a Job / Internship</h2>

        <input name="name" placeholder="Company Name" value={job.name} onChange={handleChange} required />
        <input name="position" placeholder="Job/Internship Position" value={job.position} onChange={handleChange} required />
        <input name="place" placeholder="Location" value={job.place} onChange={handleChange} required />
        <input name="salary" placeholder="Salary / Stipend" value={job.salary} onChange={handleChange} required />
        <input name="experience" placeholder="Experience (e.g. 0-2 yrs)" value={job.experience} onChange={handleChange} />
        <input name="eligibility" placeholder="Eligibility Criteria" value={job.eligibility} onChange={handleChange} />
        <select name="type" value={job.type} onChange={handleChange}>
          <option value="job">Job</option>
          <option value="internship">Internship</option>
        </select>
        <input name="openings" placeholder="Number of Openings" value={job.openings} onChange={handleChange} />
        <input name="lastDate" placeholder="Last Date to Apply" value={job.lastDate} onChange={handleChange} />
        <input name="skills" placeholder="Required Skills (comma separated)" value={job.skills} onChange={handleChange} />
        <textarea name="responsibilities" placeholder="Responsibilities" value={job.responsibilities} onChange={handleChange} rows="4" />
        <input name="applyLink" placeholder="Apply Link or Email" value={job.applyLink} onChange={handleChange} required />

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
