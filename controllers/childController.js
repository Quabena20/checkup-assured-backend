const User = require('../models/User');
const { autoAssignHospital } = require('../utils/matching');

// Register a child under a parent account
exports.registerChild = async (req, res) => {
  try {
    const { fullName, dateOfBirth, ghanaCard, location, packageSelected } = req.body;

    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (age >= 18) return res.status(400).json({ message: 'Child must be under 18' });

    const child = new User({
      fullName,
      dateOfBirth,
      ghanaCard,
      location,
      packageSelected,
      isChild: true,
      parentId: req.user._id,
      role: 'client',
      active: true,
      paymentStatus: 'pending'
    });

    await child.save();
    await autoAssignHospital(child);

    res.status(201).json({ message: 'Child registered successfully', child });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register child' });
  }
};

// Fetch all children linked to the logged-in client
exports.getMyChildren = async (req, res) => {
  try {
    const children = await User.find({
      isChild: true,
      parentId: req.user._id
    }).select('-password');

    res.status(200).json(children);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch children' });
  }
};
