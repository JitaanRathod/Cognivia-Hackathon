const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    age: { type: Number },
    location: { type: String },

    pregnancyStatus: {
      type: String,
      enum: ['Not pregnant', 'Pregnant', 'Recently delivered', 'Menopause']
    },

    knownConditions: {
      type: [String],
      enum: ['BP', 'Diabetes', 'Thyroid', 'PCOS', 'Anemia']
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
