const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['Period', 'Heart', 'Pregnancy', 'Lifestyle'], required: true },
  symptoms: { type: [String] }, // Array of symptoms like ['irregular periods', 'tiredness']
  severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'], default: 'Mild' },
  notes: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Symptom', symptomSchema);
