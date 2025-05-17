const User = require('../models/User');
const Claim = require('../models/Claim');

// Main Admin Metrics
exports.getMainAdminMetrics = async (req, res) => {
  try {
    const totalClients = await User.countDocuments({ role: 'client', isChild: false });
    const totalChildren = await User.countDocuments({ isChild: true });
    const activeClients = await User.countDocuments({ role: 'client', active: true, isChild: false });
    const inactiveClients = totalClients - activeClients;
    const totalHospitals = await User.countDocuments({ role: 'hospital' });
    const totalCompanies = await User.countDocuments({ role: 'company' });
    const totalReps = await User.countDocuments({ role: 'salesRep' });

    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    const monthlyNewClients = await User.countDocuments({
      role: 'client',
      isChild: false,
      createdAt: { $gte: firstDayOfMonth }
    });

    const claimsSubmitted = await Claim.countDocuments();
    const claimsApproved = await Claim.countDocuments({ status: 'approved' });
    const claimsRejected = await Claim.countDocuments({ status: 'rejected' });

    res.status(200).json({
      totalClients,
      totalChildren,
      activeClients,
      inactiveClients,
      totalHospitals,
      totalCompanies,
      totalReps,
      monthlyNewClients,
      claims: {
        submitted: claimsSubmitted,
        approved: claimsApproved,
        rejected: claimsRejected
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin metrics' });
  }
};

// Hospital Metrics
exports.getHospitalMetrics = async (req, res) => {
  try {
    const totalClients = await Claim.countDocuments({ hospitalId: req.user._id });
    const claims = await Claim.find({ hospitalId: req.user._id });
    const totalTests = claims.length;

    res.status(200).json({
      totalClients,
      totalClaims: claims.length,
      totalTests
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hospital metrics' });
  }
};

// Company Metrics
exports.getCompanyMetrics = async (req, res) => {
  try {
    const staff = await User.find({ companyId: req.user._id, isStaff: true });
    const totalStaff = staff.length;
    const active = staff.filter(s => s.active).length;
    const inactive = totalStaff - active;

    const packageCount = {};
    staff.forEach(s => {
      if (s.packageSelected) {
        packageCount[s.packageSelected] = (packageCount[s.packageSelected] || 0) + 1;
      }
    });

    res.status(200).json({
      totalStaff,
      activeStaff: active,
      inactiveStaff: inactive,
      packages: packageCount
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch company metrics' });
  }
};
