const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const sendVerificationEmail = require('../utils/mailer');

// Signup Route with email verification
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString('hex');

    const user = new User({ email, password: hashedPassword, verifyToken });
    await user.save();

    await sendVerificationEmail(email, verifyToken);

    res.status(201).json({ success: true, message: 'User created. Please verify your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Email verification route
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verifyToken: token });
    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.send('<h2>Email verified successfully. You can now log in.</h2>');
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login with verification check
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Invalid credentials' });

    if (!user.isVerified)
      return res.status(403).json({ success: false, message: 'Please verify your email first' });

    res.json({ success: true, message: 'Login successful', email: user.email });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
=======
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
>>>>>>> f48583d2789b1675fe8aa71e452ef9139f13f302
  }
});

module.exports = router;
