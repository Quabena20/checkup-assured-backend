const User = require('../models/User');

exports.autoAssignHospital = async (user) => {
  const hospitals = await User.find({ role: 'hospital' });

  if (!user.address || hospitals.length === 0) return;

  const match = hospitals.find(h => h.location === user.address);

  if (match) {
    user.assignedHospital = match._id;
    await user.save();
  }
};
