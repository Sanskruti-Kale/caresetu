const mongoose = require('mongoose');

const dependentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  relationship: { type: String, enum: ['Child', 'Parent', 'Spouse', 'Other'], default: 'Child' },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  bloodGroup: { type: String, default: '' },
  allergies: [{ type: String }],
  pediatrician: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dependent', dependentSchema);
