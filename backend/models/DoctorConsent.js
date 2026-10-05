const mongoose = require('mongoose');

const doctorConsentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: { type: String, required: true },
  doctorEmail: { type: String, default: '' },
  accessCode: { type: String, required: true, unique: true },
  sharedSections: {
    reports: { type: Boolean, default: true },
    medicines: { type: Boolean, default: true },
    timeline: { type: Boolean, default: true },
    dependents: { type: Boolean, default: false }
  },
  dependentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dependent', default: null },
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: ['active', 'revoked', 'expired'], default: 'active' },
  consentGrantedAt: { type: Date, default: Date.now },
  revokedAt: { type: Date, default: null },
  accessLog: [{
    accessedAt: { type: Date, default: Date.now },
    ip: { type: String, default: '' },
    action: { type: String, default: 'Viewed records' }
  }]
});

module.exports = mongoose.model('DoctorConsent', doctorConsentSchema);
