const express = require('express');
const router = express.Router();

const { fieldsUpload } = require('../middleware/upload');
const { registerUser, loginUser } = require('../controllers/authController');

// Upload fields: Ghana Card, face photo, CV, certificate, cover letter
const registrationUploads = fieldsUpload([
  { name: 'ghanaCard', maxCount: 1 },
  { name: 'facePhoto', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'certificate', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
]);

// Registration with all documents
router.post('/register', registrationUploads, registerUser);

// Login
router.post('/login', loginUser);

module.exports = router;
