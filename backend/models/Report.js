const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dependentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dependent', default: null },
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['Cardiology', 'Laboratory', 'Radiology', 'Orthopedics', 'General Medicine', 'Dental', 'Other'],
    default: 'General Medicine'
  },
  doctorName: { type: String, default: 'Attending Physician' },
  hospitalOrLab: { type: String, default: '' },
  dateOfReport: { type: Date, default: Date.now },
  fileUrl: { type: String, required: true },
  fileName: { type: String, default: 'Report.pdf' },
  fileType: { type: String, enum: ['pdf', 'jpg', 'png'], default: 'pdf' },
  fileSize: { type: Number, default: 0 },
  ocrExtractedText: { type: String, default: '' },
  aiSuggestedCategory: { type: String, default: 'General Medicine' },
  aiConfidence: { type: Number, default: 0.85 },
  aiExtractedKeywords: [{ type: String }],
  userConfirmedCategory: { type: Boolean, default: false },
  extractedParameters: [{
    key: { type: String },
    value: { type: String },
    unit: { type: String },
    referenceRange: { type: String },
    status: { type: String, enum: ['normal', 'high', 'low', 'info'], default: 'normal' }
  }],
  extractedMedications: [{
    name: { type: String },
    dosage: { type: String },
    instruction: { type: String }
  }],
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
