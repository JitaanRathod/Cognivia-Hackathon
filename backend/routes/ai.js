const express = require('express');
const auth = require('../middleware/auth');
const AIInsight = require('../models/AIInsight');
const AIConversation = require('../models/AIConversation');
const HealthRecord = require('../models/HealthRecord');
const Symptom = require('../models/Symptom');
const { generateHealthResponse } = require('../services/geminiService');

const router = express.Router();

/* ---------------- RISK LOGIC ---------------- */

function upgradeRisk(current, incoming) {
  const levels = ['Normal', 'Be Careful', 'Urgent'];
  return levels.indexOf(incoming) > levels.indexOf(current)
    ? incoming
    : current;
}

function assessRisk(healthData, symptoms) {
  let risk = 'Normal';
  const reasons = [];

  if (healthData.irregularPeriods || healthData.heavyBleeding) {
    risk = upgradeRisk(risk, 'Be Careful');
    reasons.push('Irregular or heavy periods may indicate hormonal imbalance');
  }

  if (symptoms.includes('hair fall') && symptoms.includes('tiredness')) {
    risk = upgradeRisk(risk, 'Urgent');
    reasons.push('Possible iron deficiency or thyroid-related concern');
  }

  if (healthData.bpReading && Number(healthData.bpReading) > 140) {
    risk = upgradeRisk(risk, 'Urgent');
    reasons.push('High blood pressure detected');
  }

  if (symptoms.includes('chest pain') || symptoms.includes('breathlessness')) {
    risk = upgradeRisk(risk, 'Urgent');
    reasons.push('Possible heart-related symptoms');
  }

  if (
    symptoms.includes('bleeding') ||
    symptoms.includes('vision blur') ||
    symptoms.includes('less baby movement')
  ) {
    risk = upgradeRisk(risk, 'Urgent');
    reasons.push('Possible pregnancy-related complication');
  }

  if (healthData.sleepHours && healthData.sleepHours < 6) {
    risk = upgradeRisk(risk, 'Be Careful');
    reasons.push('Inadequate sleep may affect overall health');
  }

  return { risk, reasons };
}

/* ---------------- CONVERSATION MEMORY ---------------- */

async function getConversationMemory(userId) {
  let conversation = await AIConversation.findOne({ userId });
  if (!conversation) {
    conversation = await AIConversation.create({
      userId,
      messages: [],
      lastUpdated: new Date(),
    });
  }
  return conversation;
}

async function saveToConversation(conversation, role, content) {
  conversation.messages.push({ role, content });
  conversation.lastUpdated = new Date();
  await conversation.save();
}

/* ---------------- AI INTERACTION ---------------- */

router.post('/interact', auth, async (req, res) => {
  try {
    const { input, voiceInput } = req.body;
    if (!input) {
      return res.status(400).json({ error: 'Input message is required' });
    }

    const recentRecords = await HealthRecord.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(10);

    const recentSymptoms = await Symptom.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(10);

    const allSymptoms = recentSymptoms.flatMap(s => s.symptoms || []);
    const healthData = recentRecords.reduce(
      (acc, record) => ({ ...acc, ...record.data }),
      {}
    );

    const { risk, reasons } = assessRisk(healthData, allSymptoms);
    const conversation = await getConversationMemory(req.user.id);

    const aiResponse = await generateHealthResponse({
      userMessage: input,
      riskLevel: risk,
      symptoms: allSymptoms,
      reasons,
      history: conversation.messages,
    });

    await saveToConversation(conversation, 'user', input);
    await saveToConversation(conversation, 'model', aiResponse);

    await AIInsight.create({
      userId: req.user.id,
      input,
      response: aiResponse,
      riskLevel: risk,
    });

    res.json({
      response: aiResponse,
      riskLevel: risk,
      reasons,
      ttsSuggested: Boolean(voiceInput),
    });
  } catch (error) {
    console.error('AI Interaction Error:', error);
    res.status(500).json({ error: 'AI interaction failed' });
  }
});

/* ---------------- CONVERSATION HISTORY ---------------- */

router.get('/conversation', auth, async (req, res) => {
  const conversation = await AIConversation.findOne({ userId: req.user.id });
  res.json(conversation ? conversation.messages : []);
});

router.delete('/conversation', auth, async (req, res) => {
  await AIConversation.findOneAndDelete({ userId: req.user.id });
  res.json({ message: 'Conversation cleared' });
});

module.exports = router;
