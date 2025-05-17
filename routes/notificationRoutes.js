const express = require('express');
const router = express.Router();
const { sendNotification, getUserNotifications } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, allowRoles('system-admin', 'main-admin'), sendNotification);
router.get('/', protect, getUserNotifications);

module.exports = router;
