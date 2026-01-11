const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  input: { type: String },
  response: { type: String },
  riskLevel: {
    type: String,
    enum: ['Normal', 'Be Careful', 'Urgent'],
    default: 'Normal'
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIInsight', aiInsightSchema);
