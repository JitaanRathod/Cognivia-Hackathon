const express = require('express');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');
const HealthRecord = require('../models/HealthRecord');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');

const router = express.Router();

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get notifications
router.get('/', auth, async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id }).sort({ timestamp: -1 });
  res.json(notifications);
});

// Mark as read
router.put('/:id/read', auth, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: 'Marked as read' });
});

// Send notification (internal function)
async function sendNotification(userId, type, message, priority = 'Normal') {
  const notification = new Notification({ userId, type, message, priority });
  await notification.save();

  // Send email if urgent
  if (priority === 'Urgent') {
    const user = await User.findById(userId);
    await transporter.sendMail({
      to: user.email,
      subject: 'Urgent Health Alert',
      text: message
    });
  }

  return notification;
}

// Daily reminders
schedule.scheduleJob('0 8 * * *', async () => { // 8 AM daily
  const users = await User.find({});
  for (const user of users) {
    await sendNotification(user._id, 'Reminder', 'Drink plenty of water today!');
    await sendNotification(user._id, 'Reminder', 'Take a short walk for better health.');
  }
});

// Period tracking reminders
schedule.scheduleJob('0 9 * * *', async () => { // 9 AM daily
  const users = await User.find({ pregnancyStatus: { $ne: 'Pregnant' } });
  for (const user of users) {
    const lastPeriod = await HealthRecord.findOne({ userId: user._id, type: 'Period' }).sort({ timestamp: -1 });
    if (lastPeriod) {
      const lastDate = new Date(lastPeriod.data.lastPeriodDate);
      const daysSince = Math.floor((Date.now() - lastDate) / (1000 * 60 * 60 * 24));
      if (daysSince > 35) {
        await sendNotification(user._id, 'Alert', 'Missed period? Please check and consult if needed.', 'Warning');
      } else if (daysSince === 28) {
        await sendNotification(user._id, 'Reminder', 'Expected period date today. Track your symptoms.');
      }
    }
  }
});

// Pregnancy reminders
schedule.scheduleJob('0 10 * * *', async () => { // 10 AM daily
  const pregnantUsers = await User.find({ pregnancyStatus: 'Pregnant' });
  for (const user of pregnantUsers) {
    await sendNotification(user._id, 'Reminder', 'Remember to take prenatal vitamins.');
    await sendNotification(user._id, 'Reminder', 'Monitor baby movements and visit doctor regularly.');
  }
});

// Health alerts based on records
schedule.scheduleJob('0 12 * * *', async () => { // 12 PM daily
  const users = await User.find({});
  for (const user of users) {
    const recentRecords = await HealthRecord.find({ userId: user._id, timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
    for (const record of recentRecords) {
      if (record.type === 'Heart' && record.data.bpReading > 140) {
        await sendNotification(user._id, 'Alert', 'High blood pressure detected. Consult doctor immediately.', 'Urgent');
      }
      if (record.type === 'Pregnancy' && (record.data.bleeding || record.data.visionBlur)) {
        await sendNotification(user._id, 'Alert', 'Urgent pregnancy symptom detected. Seek medical help now!', 'Urgent');
      }
    }
  }
});

// Monthly health summary
schedule.scheduleJob('0 9 1 * *', async () => { // 1st of every month
  const users = await User.find({});
  for (const user of users) {
    const monthlyRecords = await HealthRecord.find({
      userId: user._id,
      timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    const summary = `Monthly Summary: ${monthlyRecords.length} health entries recorded. Keep tracking!`;
    await sendNotification(user._id, 'Summary', summary);
  }
});

module.exports = router;
