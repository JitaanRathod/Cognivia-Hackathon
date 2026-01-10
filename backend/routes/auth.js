const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const router = express.Router();

// Signup
router.post('/signup', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('confirmPassword').custom((value, { req }) => value === req.body.password),
  body('acceptTerms').equals('true').withMessage('You must accept the terms and privacy policy')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password, name, acceptTerms } = req.body;
  try {
    const user = new User({ email, password, name });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: rememberMe ? '7d' : '1h' });
  res.json({ token });
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  // Send email with reset link (using Nodemailer)
  const transporter = nodemailer.createTransporter({ /* config */ });
  await transporter.sendMail({ to: email, subject: 'Reset Password', html: `<a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Reset</a>` });
  res.json({ message: 'Reset link sent' });
});

module.exports = router;