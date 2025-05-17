const express = require('express');
const router = express.Router();
const { getConstant, setConstant } = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/constant', protect, allowRoles('financial-admin'), getConstant);
router.post('/constant', protect, allowRoles('financial-admin'), setConstant);

module.exports = router;
