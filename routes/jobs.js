const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const jobsFilePath = path.join(__dirname, '../data/jobs.json');


// 🔹 GET job by ID
router.get('/:id', (req, res) => {
  const jobId = parseInt(req.params.id);
  fs.readFile(jobsFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ success: false, message: 'File read error' });
    const jobs = JSON.parse(data || '[]');
    const job = jobs.find(j => j.id === jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json(job);
  });
});

// 🔹 GET all jobs
// 🔹 GET all jobs (most recent first)
router.get('/', (req, res) => {
  fs.readFile(jobsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("File read error:", err);
      return res.status(500).json({ success: false, message: 'Error reading jobs file' });
    }

    try {
      const jobs = JSON.parse(data || '[]');
      const sortedJobs = jobs.sort((a, b) => b.id - a.id); // Most recent first
      res.json(sortedJobs);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return res.status(500).json({ success: false, message: 'Invalid jobs JSON format' });
    }
  });
});

// 🔹 POST a job
router.post('/', (req, res) => {
  const newJob = {
    id: Date.now(),
    ...req.body,
  };

  fs.readFile(jobsFilePath, 'utf8', (err, data) => {
    const jobs = data ? JSON.parse(data) : [];

    jobs.push(newJob);

    fs.writeFile(jobsFilePath, JSON.stringify(jobs, null, 2), (err) => {
      if (err) {
        console.error("Write error:", err);
        return res.status(500).json({ success: false, message: 'Error writing job file' });
      }
      res.json({ success: true, job: newJob });
    });
  });
});

// 🔹 DELETE a job
router.delete('/:id', (req, res) => {
  const jobId = parseInt(req.params.id);
  const userEmail = req.query.email;

  fs.readFile(jobsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("File read error:", err);
      return res.status(500).json({ success: false, message: 'Error reading jobs file' });
    }

    let jobs = JSON.parse(data || '[]');
    const jobToDelete = jobs.find(job => job.id === jobId);

    if (!jobToDelete) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (jobToDelete.postedBy !== userEmail) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only delete your own job' });
    }

    jobs = jobs.filter(job => job.id !== jobId);

    fs.writeFile(jobsFilePath, JSON.stringify(jobs, null, 2), (err) => {
      if (err) {
        console.error("Write error:", err);
        return res.status(500).json({ success: false, message: 'Error deleting job' });
      }
      res.json({ success: true, message: 'Job deleted successfully' });
    });
  });
});

module.exports = router;
