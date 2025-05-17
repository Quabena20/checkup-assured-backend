const User = require('../models/User');
const { autoAssignHospital } = require('../utils/matching');

// Company registers staff
exports.registerStaff = async (req, res) => {
  try {
    const {
      fullName, email, phone, address,
      ghanaCard, location, packageSelected, passportPhoto
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Staff email already exists' });

    const staff = new User({
      fullName,
      email,
      phone,
      address,
      location,
      ghanaCard,
      packageSelected,
      passportPhoto,
      role: 'client',
      isStaff: true,
      companyId: req.user._id,
      active: true,
      paymentStatus: 'pending'
    });

    await staff.save();
    await autoAssignHospital(staff);

    res.status(201).json({ message: 'Staff registered successfully', staff });
  } catch (err) {
    res.status(500).json({ message: 'Staff registration failed' });
  }
};

// View all staff for company
exports.getMyStaff = async (req, res) => {
  try {
    const staffList = await User.find({
      role: 'client',
      isStaff: true,
      companyId: req.user._id
    }).select('-password');
    res.status(200).json(staffList);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch staff' });
  }
};
