const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['Period', 'Heart', 'Pregnancy', 'Lifestyle', 'Assessment'],
    required: true
  },
  data: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

healthRecordSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
