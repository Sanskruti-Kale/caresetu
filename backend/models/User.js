const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  phone: { type: String, default: '' },
  bloodGroup: { type: String, default: '' },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  allergies: [{ type: String }],
  chronicConditions: [{ type: String }],
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relation: { type: String, default: '' }
  },
  specialty: { type: String, default: '' }, // For doctor accounts
  hospital: { type: String, default: '' }, // For doctor accounts
  registrationNumber: { type: String, default: '' }, // For doctor accounts
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
