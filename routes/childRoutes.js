const express = require('express');
const router = express.Router();
const {
  registerChild,
  getMyChildren
} = require('../controllers/childController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/register', protect, allowRoles('client'), registerChild);
router.get('/my-children', protect, allowRoles('client'), getMyChildren);

module.exports = router;
