const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const {
  addMedicalRecord,
  getMedicalHistory
} = require('../controllers/medicalController');

router.post('/add', protect, allowRoles('hospital'), addMedicalRecord);
router.get('/history', protect, allowRoles('client', 'hospital', 'company'), getMedicalHistory);

module.exports = router;
