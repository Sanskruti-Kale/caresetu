const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  dependentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dependent', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vaccineName: { type: String, required: true },
  targetAge: { type: String, default: 'Infant' },
  scheduledDate: { type: Date },
  givenDate: { type: Date, default: null },
  status: { type: String, enum: ['given', 'due', 'upcoming'], default: 'upcoming' },
  administeredBy: { type: String, default: '' },
  batchNumber: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vaccination', vaccinationSchema);
