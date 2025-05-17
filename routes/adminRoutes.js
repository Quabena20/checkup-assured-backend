const express = require('express');
const router = express.Router();

// Temporary route just to prevent crashing
router.get('/', (req, res) => {
  res.send('Admin routes are working');
});

module.exports = router;
