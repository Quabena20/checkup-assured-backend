const express = require('express');
const router = express.Router();
const { createOrUpdatePackage, getAllPackages } = require('../controllers/packageController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, allowRoles('productAdmin'), createOrUpdatePackage);
router.get('/', protect, getAllPackages);

module.exports = router;
