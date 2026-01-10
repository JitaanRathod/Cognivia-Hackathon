const express = require('express');
const auth = require('../middleware/auth');
const AIInsight = require('../models/AIInsight');
const AIConversation = require('../models/AIConversation');
const HealthRecord = require('../models/HealthRecord');
const Symptom = require('../models/Symptom');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Advanced rule-based risk assessment
function assessRisk(healthData, symptoms) {
  let risk = 'Normal';
  let reasons = [];

  // Period-related risks
  if (healthData.irregularPeriods || healthData.heavyBleeding) {
    risk = 'Be Careful';
    reasons.push('Irregular or heavy periods may indicate hormonal issues');
  }
  if (symptoms.includes('hair fall') && symptoms.includes('tiredness')) {
    risk = 'Urgent';
    reasons.push('Possible iron deficiency or thyroid issue');
  }

  // Heart-related risks
  if (healthData.bpReading > 140) {
    risk = 'Urgent';
    reasons.push('High blood pressure requires immediate attention');
  }
  if (symptoms.includes('chest pain') || symptoms.includes('breathlessness')) {
    risk = 'Urgent';
    reasons.push('Cardiac symptoms detected');
  }

  // Pregnancy-related risks
  if (symptoms.includes('bleeding') || symptoms.includes('vision blur') || symptoms.includes('less baby movement')) {
    risk = 'Urgent';
    reasons.push('Pregnancy complications detected');
  }

  // Lifestyle risks
  if (healthData.sleepHours < 6) {
    risk = risk === 'Normal' ? 'Be Careful' : risk;
    reasons.push('Inadequate sleep may affect health');
  }

  return { risk, reasons };
}

// Get or create conversation memory for user
async function getConversationMemory(userId) {
  let conversation = await AIConversation.findOne({ userId });
  if (!conversation) {
    conversation = new AIConversation({ userId, messages: [] });
    await conversation.save();
  }
  return conversation;
}

// Save message to conversation
async function saveToConversation(conversation, role, content) {
  conversation.messages.push({ role, content });
  conversation.lastUpdated = new Date();
  await conversation.save();
}

// AI Interaction
router.post('/interact', auth, async (req, res) => {
  try {
    const { input, voiceInput } = req.body;

    // Get user's recent health data and symptoms
    const recentRecords = await HealthRecord.find({ userId: req.user.id }).sort({ timestamp: -1 }).limit(10);
    const recentSymptoms = await Symptom.find({ userId: req.user.id }).sort({ timestamp: -1 }).limit(10);
    const allSymptoms = recentSymptoms.flatMap(s => s.symptoms);

    // Assess risk
    const healthData = recentRecords.reduce((acc, record) => ({ ...acc, ...record.data }), {});
    const { risk, reasons } = assessRisk(healthData, allSymptoms);

    // Get conversation memory
    const conversation = await getConversationMemory(req.user.id);

    // Prepare chat history for Gemini
    const chat = model.startChat({
      history: conversation.messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    });

    const context = `User health context: Risk level ${risk}. Symptoms: ${allSymptoms.join(', ')}. Reasons: ${reasons.join(', ')}. Provide simple, empathetic response in local language if possible. Explain simply, suggest next steps, what to avoid, urgency level. No medical jargon.`;
    const fullPrompt = `${context}\nUser: ${input}`;

    const result = await chat.sendMessage(fullPrompt);
    const aiResponse = result.response.text();

    // Save to conversation
    await saveToConversation(conversation, 'user', input);
    await saveToConversation(conversation, 'model', aiResponse);

    // Save insight
    const insight = new AIInsight({ userId: req.user.id, input, response: aiResponse, riskLevel: risk });
    await insight.save();

    res.json({
      response: aiResponse,
      riskLevel: risk,
      reasons,
      textToSpeech: voiceInput ? true : false // Flag for TTS
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI interaction failed' });
  }
});

// Get conversation history
router.get('/conversation', auth, async (req, res) => {
  const conversation = await AIConversation.findOne({ userId: req.user.id });
  res.json(conversation ? conversation.messages : []);
});

// Clear conversation memory
router.delete('/conversation', auth, async (req, res) => {
  await AIConversation.findOneAndDelete({ userId: req.user.id });
  res.json({ message: 'Conversation cleared' });
});

module.exports = router;
