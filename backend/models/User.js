// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  age: { type: Number },
  location: { type: String },
  pregnancyStatus: { type: String, enum: ['Not pregnant', 'Pregnant', 'Recently delivered', 'Menopause'] },
  knownConditions: [{ type: String, enum: ['BP', 'Diabetes', 'Thyroid', 'PCOS', 'Anemia'] }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

// backend/models/HealthRecord.js
const healthRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Period', 'Heart', 'Pregnancy', 'Lifestyle'] },
  data: { type: mongoose.Schema.Types.Mixed }, // Flexible for various inputs
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);

// backend/models/Notification.js
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Reminder', 'Alert', 'Summary'] },
  priority: { type: String, enum: ['Normal', 'Warning', 'Urgent'], default: 'Normal' },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema);

// backend/models/AIInsight.js
const aiInsightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  input: { type: String },
  response: { type: String },
  riskLevel: { type: String, enum: ['Normal', 'Be Careful', 'Urgent'] },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIInsight', aiInsightSchema);