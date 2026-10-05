const express = require('express');
const router = express.Router();
const dependentController = require('../controllers/dependentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, dependentController.getDependents);
router.post('/', protect, dependentController.addDependent);
router.get('/:dependentId/vaccinations', protect, dependentController.getVaccinations);
router.put('/vaccinations/:vaccinationId', protect, dependentController.updateVaccinationStatus);

module.exports = router;
