const fs = require('fs');
const path = require('path');
const { getUsers, saveUsers } = require('../models/userModel');

const registerUser = (req, res) => {
  const { name, email, password } = req.body;
  const users = getUsers();

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = { name, email, password };
  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  res.json({ message: 'Login successful', user });
};

module.exports = { registerUser, loginUser };
