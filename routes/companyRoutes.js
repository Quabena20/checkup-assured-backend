const express = require('express');
const router = express.Router();
const {
  registerStaff,
  getMyStaff
} = require('../controllers/companyController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/register-staff', protect, allowRoles('company'), registerStaff);
router.get('/my-staff', protect, allowRoles('company'), getMyStaff);

module.exports = router;
