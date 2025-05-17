// routes/productRoutes.js

const express = require('express');
const router = express.Router();

const {
  createPackage,
  getAllPackages,
  updatePackage,
  deletePackage,
  getSinglePackage,
} = require('../controllers/productController');

// Create new package (by Product Admin)
router.post('/', createPackage);

// Get all packages
router.get('/', getAllPackages);

// Get one package
router.get('/:id', getSinglePackage);

// Update package
router.put('/:id', updatePackage);

// Delete package
router.delete('/:id', deletePackage);

module.exports = router;
