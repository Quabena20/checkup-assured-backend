const express = require('express');
const router = express.Router();
const {
  setPrimaryAccount,
  getPrimaryAccount
} = require('../controllers/settingController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/primary-account', protect, allowRoles('mainAdmin'), setPrimaryAccount);
router.get('/primary-account', protect, getPrimaryAccount);

module.exports = router;
