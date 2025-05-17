const express = require('express');
const router = express.Router();
const {
  submitContact,
  getInbox,
  sendBulkMessage
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', submitContact);           // Public "Contact Us"
router.get('/inbox', protect, getInbox);   // Inbox for customer service admin
router.post('/broadcast', protect, sendBulkMessage); // Broadcast email

module.exports = router;
