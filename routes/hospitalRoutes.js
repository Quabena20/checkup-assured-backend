const express = require('express');
const router = express.Router();
const {
  verifyClient,
  updateTestServices,
  submitClaim
} = require('../controllers/hospitalController');

const { protect } = require('../middleware/authMiddleware');

router.post('/verify-client', protect, verifyClient);
router.put('/update-tests', protect, updateTestServices);
router.post('/submit-claim', protect, submitClaim);

module.exports = router;
