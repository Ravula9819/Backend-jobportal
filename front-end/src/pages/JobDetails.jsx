import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  // 🔹 GET job by ID
  useEffect(() => {
    fetch(`https://job-portal-production-6a86.up.railway.app/api/jobs/${id}`)

      .then(res => {
        if (!res.ok) throw new Error('Job not found');
        return res.json();
      })
      .then(data => setJob(data))
      .catch(err => {
        console.error('Error fetching job:', err);
        setJob(null);
      });
  }, [id]);

  if (!job) return <p>Loading job details...</p>;

  return (
    <div className="job-details">
      <h2>{job.position} @ {job.name}</h2>
      <p><strong>Place:</strong> {job.place}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p><strong>Experience:</strong> {job.experience}</p>
      <p><strong>Eligibility:</strong> {job.eligibility}</p>
      <p><strong>Type:</strong> {job.type}</p>
      <p><strong>Openings:</strong> {job.openings}</p>
      <p><strong>Last Date to Apply:</strong> {job.lastDate}</p>
      <p><strong>Skills Required:</strong> {job.skills}</p>
      <p><strong>Responsibilities:</strong> {job.responsibilities}</p>
   <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
  Apply
</a>

  


    </div>
  );
};

export default JobDetails;
