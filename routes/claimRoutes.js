const express = require('express');
const router = express.Router();
const {
  submitClaim,
  reviewClaim,
  getClaims
} = require('../controllers/claimController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/submit', protect, allowRoles('hospital'), submitClaim);
router.put('/review', protect, allowRoles('financialAdmin'), reviewClaim);
router.get('/', protect, allowRoles('hospital', 'financialAdmin'), getClaims);

module.exports = router;
