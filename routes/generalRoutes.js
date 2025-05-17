const express = require('express');
const router = express.Router();

router.get('/copyright', (req, res) => {
  const year = new Date().getFullYear();
  const message = `© ${year} CheckUp Assured. Developed by Enoch Adjei.`;
  res.json({ message });
});

module.exports = router;
