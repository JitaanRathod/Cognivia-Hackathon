const express = require('express');
const auth = require('../middleware/auth');
const HealthRecord = require('../models/HealthRecord');
const Symptom = require('../models/Symptom');

const router = express.Router();

// Submit general health data
router.post('/', auth, async (req, res) => {
  const { type, data } = req.body;
  const record = new HealthRecord({ userId: req.user.id, type, data });
  await record.save();
  res.json({ message: 'Record saved' });
});

// Get user health records
router.get('/', auth, async (req, res) => {
  const records = await HealthRecord.find({ userId: req.user.id }).sort({ timestamp: -1 });
  res.json(records);
});

// Submit period & hormonal health data
router.post('/period', auth, async (req, res) => {
  const { lastPeriodDate, regular, painLevel, heavyBleeding, moodChanges, acne, hairFall, weightGain } = req.body;
  const data = { lastPeriodDate, regular, painLevel, heavyBleeding, moodChanges, acne, hairFall, weightGain };
  const record = new HealthRecord({ userId: req.user.id, type: 'Period', data });
  await record.save();

  // Save symptoms
  const symptoms = [];
  if (hairFall) symptoms.push('hair fall');
  if (acne) symptoms.push('acne');
  if (weightGain) symptoms.push('weight gain');
  if (symptoms.length > 0) {
    const symptomRecord = new Symptom({ userId: req.user.id, category: 'Period', symptoms, severity: painLevel === 'Severe' ? 'Severe' : 'Mild' });
    await symptomRecord.save();
  }

  res.json({ message: 'Period data saved' });
});

// Submit heart health data
router.post('/heart', auth, async (req, res) => {
  const { bpReading, chestPain, breathlessness, dizziness, stressLevel } = req.body;
  const data = { bpReading, chestPain, breathlessness, dizziness, stressLevel };
  const record = new HealthRecord({ userId: req.user.id, type: 'Heart', data });
  await record.save();

  // Save symptoms
  const symptoms = [];
  if (chestPain) symptoms.push('chest pain');
  if (breathlessness) symptoms.push('breathlessness');
  if (dizziness) symptoms.push('dizziness');
  if (symptoms.length > 0) {
    const symptomRecord = new Symptom({ userId: req.user.id, category: 'Heart', symptoms, severity: bpReading > 140 ? 'Severe' : 'Moderate' });
    await symptomRecord.save();
  }

  res.json({ message: 'Heart data saved' });
});

// Submit pregnancy & maternal health data
router.post('/pregnancy', auth, async (req, res) => {
  const { pregnancyMonth, doctorVisit, headache, visionBlur, lessMovement, bleeding, breastPain, moodIssues } = req.body;
  const data = { pregnancyMonth, doctorVisit, headache, visionBlur, lessMovement, bleeding, breastPain, moodIssues };
  const record = new HealthRecord({ userId: req.user.id, type: 'Pregnancy', data });
  await record.save();

  // Save symptoms
  const symptoms = [];
  if (headache) symptoms.push('headache');
  if (visionBlur) symptoms.push('vision blur');
  if (lessMovement) symptoms.push('less baby movement');
  if (bleeding) symptoms.push('bleeding');
  if (breastPain) symptoms.push('breast pain');
  if (moodIssues) symptoms.push('mood issues');
  if (symptoms.length > 0) {
    const symptomRecord = new Symptom({ userId: req.user.id, category: 'Pregnancy', symptoms, severity: bleeding || visionBlur ? 'Severe' : 'Moderate' });
    await symptomRecord.save();
  }

  res.json({ message: 'Pregnancy data saved' });
});

// Submit lifestyle data (daily health log)
router.post('/lifestyle', auth, async (req, res) => {
  const { sleepHours, mood, energy, symptoms, notes, foodHabits, physicalActivity } = req.body;
  const data = { sleepHours, mood, energy, symptoms, notes, foodHabits, physicalActivity };
  const record = new HealthRecord({ userId: req.user.id, type: 'Lifestyle', data });
  await record.save();

  // Save symptoms as separate records for tracking
  if (Array.isArray(symptoms) && symptoms.length > 0) {
    const symptomRecord = new Symptom({ userId: req.user.id, category: 'Lifestyle', symptoms, severity: 'Moderate' });
    await symptomRecord.save();
  }

  res.json({ message: 'Lifestyle data saved' });
});

// Submit assessment (Health Assessment)
router.post('/assessment', auth, async (req, res) => {
  const { responses, scores } = req.body;
  const record = new HealthRecord({ userId: req.user.id, type: 'Assessment', data: { responses, scores } });
  await record.save();
  res.json({ message: 'Assessment saved', id: record._id });
});

// Get latest assessment
router.get('/assessment', auth, async (req, res) => {
  const assessment = await HealthRecord.findOne({ userId: req.user.id, type: 'Assessment' }).sort({ timestamp: -1 });
  res.json(assessment || {});
});

// Get symptoms
router.get('/symptoms', auth, async (req, res) => {
  const symptoms = await Symptom.find({ userId: req.user.id }).sort({ timestamp: -1 });
  res.json(symptoms);
});

module.exports = router;
