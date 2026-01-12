const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const router = express.Router();

/**
 * SIGNUP
 */
router.post(
  '/signup',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('confirmPassword').custom((value, { req }) => value === req.body.password),
    body('acceptTerms').custom(value => value === true)
      .withMessage('You must accept the terms and privacy policy')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const user = new User({ email, password, name });
      await user.save();

      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update profile
const auth = require('../middleware/auth');
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = (({ name, age, dob, phone, emergencyContact, height, weight, bloodType, location, pregnancyStatus, knownConditions }) => ({ name, age, dob, phone, emergencyContact, height, weight, bloodType, location, pregnancyStatus, knownConditions }))(req.body);
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true });
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * LOGIN
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? '7d' : '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * FORGOT PASSWORD
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: email,
      subject: 'Reset Password',
      html: `<a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Reset Password</a>`
    });

    res.json({ message: 'Reset link sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

module.exports = router;
