const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Step 1: Upload & analyze with OCR + AI suggestion (Staging)
router.post('/analyze', protect, upload.single('reportFile'), reportController.analyzeReport);

// Step 2: Confirm category and save to health records
router.post('/confirm-save', protect, reportController.confirmAndSaveReport);

// Standard CRUD
router.get('/', protect, reportController.getReports);
router.get('/:id', protect, reportController.getReportById);
router.delete('/:id', protect, reportController.deleteReport);

// "What Changed?" Comparison between two records
router.post('/compare', protect, reportController.compareTwoReports);

module.exports = router;
