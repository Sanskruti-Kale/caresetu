const express = require('express');
const router = express.Router();
const timelineController = require('../controllers/timelineController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, timelineController.getTimeline);
router.post('/', protect, timelineController.addTimelineEvent);

module.exports = router;
