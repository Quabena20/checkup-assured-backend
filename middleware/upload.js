// middleware/upload.js

const multer = require('multer');
const path = require('path');

// Storage for local file system (you can switch to memoryStorage if needed)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image and document files are allowed'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// Export upload handlers
module.exports = {
  singleUpload: (fieldName) => upload.single(fieldName),
  multipleUpload: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount),
  fieldsUpload: (fieldsArray) => upload.fields(fieldsArray),
};
