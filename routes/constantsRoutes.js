const express = require('express');
const router = express.Router();
const { setCostConstant, getCostConstant } = require('../controllers/constantsController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/set', protect, allowRoles('financialAdmin'), setCostConstant);
router.get('/', protect, getCostConstant);

module.exports = router;
