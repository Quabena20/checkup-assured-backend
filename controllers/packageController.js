const Package = require('../models/Package');

// PRODUCT ADMIN creates or updates a package
exports.createOrUpdatePackage = async (req, res) => {
  try {
    const { packageId, name, description, basePrice, testsIncluded } = req.body;

    let pkg;
    if (packageId) {
      pkg = await Package.findByIdAndUpdate(
        packageId,
        { name, description, basePrice, testsIncluded, updatedAt: new Date() },
        { new: true }
      );
    } else {
      pkg = await Package.create({
        name,
        description,
        basePrice,
        testsIncluded,
        createdBy: req.user._id
      });
    }

    res.status(200).json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Package creation failed' });
  }
};

// Get all packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch packages' });
  }
};
