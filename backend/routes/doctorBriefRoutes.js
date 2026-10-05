const express = require('express');
const router = express.Router();
const doctorBriefController = require('../controllers/doctorBriefController');
const { protect } = require('../middleware/authMiddleware');

// Patient generates brief & consent shares
router.get('/', protect, doctorBriefController.getDoctorBrief);
router.post('/share', protect, doctorBriefController.createShareConsent);
router.get('/consents', protect, doctorBriefController.getUserConsents);
router.delete('/consents/:consentId', protect, doctorBriefController.revokeConsent);

// Doctor verification portal (Public route authenticated by the 6-character accessCode)
router.post('/doctor-access', doctorBriefController.doctorAccessByCode);

module.exports = router;
