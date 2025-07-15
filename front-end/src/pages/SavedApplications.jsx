import React, { useEffect, useState } from 'react';
import './SavedApplications.css';
import { useNavigate } from 'react-router-dom';

const SavedApplications = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedInterns, setSavedInterns] = useState([]);
  const navigate = useNavigate();
  const email = localStorage.getItem('userEmail');

useEffect(() => {
  if (!email) return;

 fetch(`https://job-portal-production-6a86.up.railway.app/api/auth/saved-applications/${email}`)


    .then(res => res.json())
    .then(data => {
      console.log("Received saved applications:", JSON.stringify(data, null, 2));


      if (data.success) {
        const jobList = data.applications.filter(app => app.type === 'job');
        const internList = data.applications.filter(app => app.type === 'internship');
        setSavedJobs(jobList);
        setSavedInterns(internList);
      } else {
        console.error('Error fetching saved applications:', data.message);
      }
    })
    .catch(err => console.error('Error:', err));
}, [email]);


  const handleUnsave = async (jobId) => {
    const res = await fetch('https://job-portal-production-6a86.up.railway.app/api/auth/unsave-application', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, jobId }),
    });

    const data = await res.json();
    if (data.success) {
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      setSavedInterns(prev => prev.filter(intern => intern.id !== jobId));
      alert('Removed from saved');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Saved Jobs</h2>
      {savedJobs.length === 0 ? (
        <p>No saved jobs yet.</p>
      ) : (
        savedJobs.map((job) => (
          <div className="listing-card" key={job.id}>
            <h3>{job.position} @ {job.name}</h3>
            <p><strong>Place:</strong> {job.place}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <p><strong>Experience:</strong> {job.experience}</p>
            <p><strong>Eligibility:</strong> {job.eligibility}</p>
            <button onClick={() => navigate(`/job-details/${job.id}`)}>Details</button>


            <button onClick={() => handleUnsave(job.id)}>Unsave</button>
          </div>
        ))
      )}

      <h2>Saved Internships</h2>
      {savedInterns.length === 0 ? (
        <p>No saved internships yet.</p>
      ) : (
        savedInterns.map((intern) => (
          <div className="listing-card" key={intern.id}>
            <h3>{intern.position} @ {intern.name}</h3>
            <p><strong>Place:</strong> {intern.place}</p>
            <p><strong>Salary:</strong> {intern.salary}</p>
            <p><strong>Experience:</strong> {intern.experience}</p>
            <p><strong>Eligibility:</strong> {intern.eligibility}</p>
            <button onClick={() => navigate(`/job-details/${intern.id}`)}>Details</button>

            <button onClick={() => handleUnsave(intern.id)}>Unsave</button>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedApplications;
