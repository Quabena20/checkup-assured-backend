const express = require('express');
const router = express.Router();
const {
  generateMonthlyCommissions,
  payRepCommission,
  getMyCommissions
} = require('../controllers/commissionController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/my', protect, allowRoles('salesRep'), getMyCommissions);
router.post('/generate', protect, allowRoles('financialAdmin'), generateMonthlyCommissions);
router.post('/pay', protect, allowRoles('financialAdmin'), payRepCommission);

module.exports = router;
