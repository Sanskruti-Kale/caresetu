const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, medicineController.getMedicines);
router.post('/', protect, medicineController.addMedicine);
router.get('/today', protect, medicineController.getTodaySchedule);
router.post('/:medicineId/log-dose', protect, medicineController.logDose);

module.exports = router;
