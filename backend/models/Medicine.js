const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dependentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dependent', default: null },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true }, // e.g. "Once daily", "Twice daily"
  startDate: { type: Date, required: true },
  durationDays: { type: Number, required: true }, // e.g. 15 days
  endDate: { type: Date, required: true }, // reminders stop after duration
  reminderTimes: [{ type: String }], // ["08:30 AM", "08:30 PM"]
  instructions: { type: String, default: 'After food' },
  prescribedBy: { type: String, default: 'Doctor' },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  doseLogs: [{
    date: { type: Date, default: Date.now },
    time: { type: String },
    status: { type: String, enum: ['taken', 'missed', 'skipped'], default: 'taken' },
    loggedAt: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
  }],
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medicine', medicineSchema);
