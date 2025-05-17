const express = require('express');
const router = express.Router();
const { payHospital } = require('../controllers/payoutController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/hospital', protect, allowRoles('financialAdmin'), payHospital);

module.exports = router;
