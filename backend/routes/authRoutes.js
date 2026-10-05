const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/demo-login', authController.demoLogin);
router.post('/forgot-password', authController.forgotPassword);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.delete('/account', protect, authController.deleteAccount);
router.post('/reset-demo-data', authController.resetDemoData);

module.exports = router;
