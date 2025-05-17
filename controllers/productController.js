// controllers/productController.js

const Package = require('../models/Package');

// Create a new package
const createPackage = async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating package' });
  }
};

// Get all packages
const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving packages' });
  }
};

// Get a single package by ID
const getSinglePackage = async (req, res) => {
  try {
    const single = await Package.findById(req.params.id);
    if (!single) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(single);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching package' });
  }
};

// Update a package
const updatePackage = async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating package' });
  }
};

// Delete a package
const deletePackage = async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Package deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting package' });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
};
