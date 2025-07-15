const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { getAllUsers, saveUsers } = require('../models/userModel');

const usersFile = path.join(__dirname, '../data/users.json');
const jobsFile = path.join(__dirname, '../data/jobs.json');

// Register
router.post('/register', (req, res) => {
  const { fullName, email, phone, password, education, skills, experience } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const users = getAllUsers();

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const newUser = {
    id: Date.now(),
    fullName,
    email,
    phone,
    password,
    education,
    skills,
    experience,
    jobsApplied: 0,
    internsApplied: 0,
    savedApplications: []
  };

  users.push(newUser);
  saveUsers(users);

  return res.json({ success: true, message: 'User registered successfully', user: newUser });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) {
      console.error("Read error:", err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    const users = JSON.parse(data);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    res.status(200).json({ success: true, message: 'Login successful', user });
  });
});

// Increment jobs/interns count
router.post('/increment', (req, res) => {
  const { email, type } = req.body;
  if (!email || !type) {
    return res.status(400).json({ success: false, message: 'Missing email or type' });
  }

  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (type === 'job') {
    users[userIndex].jobsApplied = (users[userIndex].jobsApplied || 0) + 1;
  } else if (type === 'internship') {
    users[userIndex].internsApplied = (users[userIndex].internsApplied || 0) + 1;
  } else {
    return res.status(400).json({ success: false, message: 'Invalid type' });
  }

  saveUsers(users);
  res.json({ success: true });
});

// Save application
router.post('/save-application', (req, res) => {
  const { email, jobId } = req.body;
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const saved = users[userIndex].savedApplications || [];
  if (saved.includes(jobId)) {
    return res.status(400).json({ success: false, message: 'Already saved' });
  }

  saved.push(jobId);
  users[userIndex].savedApplications = saved;
  saveUsers(users);
  res.json({ success: true });
});

// Get saved applications
router.get('/saved-applications/:email', (req, res) => {
  const email = req.params.email;
  const users = getAllUsers();
  const jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.json({ success: false, message: 'User not found' });
  }

  const savedIds = user.savedApplications || [];

  const applications = savedIds
    .map(id => jobs.find(job => job.id.toString() === id.toString()))
    .filter(Boolean);

  return res.json({ success: true, applications });
});

// Unsave application
router.post('/unsave-application', (req, res) => {
  const { email, jobId } = req.body;
  const users = getAllUsers();

  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const updatedList = users[userIndex].savedApplications.filter(id => id !== jobId);
  users[userIndex].savedApplications = updatedList;
  saveUsers(users);
  res.json({ success: true, message: 'Application removed' });
});

// Get saved count
router.get('/saved-count/:email', (req, res) => {
  const { email } = req.params;
  const users = getAllUsers();

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const count = user.savedApplications ? user.savedApplications.length : 0;
  res.json({ success: true, count });
});

// Get user by email
router.get('/users/:email', (req, res) => {
  const { email } = req.params;
  const users = getAllUsers();

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.status(200).json({ success: true, user: userWithoutPassword });
});



// Storage settings for resume upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// Profile update route
router.put('/update-profile/:email', upload.single('resume'), (req, res) => {
  const { email } = req.params;
  const users = getAllUsers();

  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const user = users[userIndex];

  const { fullName, phone, skills } = req.body;

  if (fullName) user.fullName = fullName;
  if (phone) user.phone = phone;
  if (skills) user.skills = skills;
  if (req.file) user.resume = req.file.filename;

  users[userIndex] = user;
  saveUsers(users);

  const { password, ...userWithoutPassword } = user;
  return res.json({ success: true, message: 'Profile updated', user: userWithoutPassword });
});


module.exports = router;
