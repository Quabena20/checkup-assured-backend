const express = require('express');
const router = express.Router();
const {
  getMainAdminMetrics,
  getHospitalMetrics,
  getCompanyMetrics
} = require('../controllers/dashboardController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/main', protect, allowRoles('mainAdmin'), getMainAdminMetrics);
router.get('/hospital', protect, allowRoles('hospital'), getHospitalMetrics);
router.get('/company', protect, allowRoles('company'), getCompanyMetrics);

module.exports = router;
