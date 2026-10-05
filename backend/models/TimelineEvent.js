const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dependentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dependent', default: null },
  eventType: {
    type: String,
    enum: ['report', 'visit', 'medicine', 'vaccine', 'event'],
    default: 'event'
  },
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, default: 'General Medicine' },
  doctorOrSpecialty: { type: String, default: '' },
  description: { type: String, default: '' },
  relatedReportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', default: null },
  relatedMedicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', default: null },
  vitals: {
    bp: { type: String, default: '' },
    pulse: { type: String, default: '' },
    glucose: { type: String, default: '' },
    weight: { type: String, default: '' },
    temp: { type: String, default: '' },
    cholesterol: { type: String, default: '' }
  },
  icon: { type: String, default: 'activity' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TimelineEvent', timelineEventSchema);
