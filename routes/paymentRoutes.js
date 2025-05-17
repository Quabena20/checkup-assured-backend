const express = require('express');
const router = express.Router();
const {
  getPaymentConfig,
  updatePaymentConfig,
  updatePrimaryAccount
} = require('../controllers/paymentController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/', getPaymentConfig);
router.put('/update', protect, allowRoles('productAdmin'), updatePaymentConfig);
router.put('/primary', protect, allowRoles('mainAdmin'), updatePrimaryAccount);

module.exports = router;
