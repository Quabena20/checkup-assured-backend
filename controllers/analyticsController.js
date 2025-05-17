const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Commission = require('../models/Commission');
const Claim = require('../models/Claim');

// MAIN ADMIN DASHBOARD SUMMARY
exports.getAdminStats = async (req, res) => {
  try {
    const [clients, companies, hospitals, reps, staff, children] = await Promise.all([
      User.countDocuments({ role: 'client', isChild: false }),
      User.countDocuments({ role: 'company' }),
      User.countDocuments({ role: 'hospital' }),
      User.countDocuments({ role: 'salesRep' }),
      User.countDocuments({ isStaff: true }),
      User.countDocuments({ isChild: true })
    ]);

    const activeClients = await User.countDocuments({ role: 'client', paymentStatus: 'active' });

    const totalPremium = await Transaction.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalClaims = await Claim.countDocuments({ status: 'approved' });
    const totalPayout = await Claim.aggregate([
      { $match: { status: 'approved', paid: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const topReps = await User.aggregate([
      { $match: { role: 'client', active: true, isChild: false } },
      { $group: { _id: '$registeredBy', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'rep'
        }
      },
      { $unwind: '$rep' },
      {
        $project: {
          repName: '$rep.fullName',
          repEmail: '$rep.email',
          totalClients: '$total'
        }
      }
    ]);

    res.status(200).json({
      counts: { clients, companies, hospitals, reps, staff, children, activeClients },
      financials: {
        totalPremium: totalPremium[0]?.total || 0,
        totalClaims,
        totalPayout: totalPayout[0]?.total || 0
      },
      topReps
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load analytics' });
  }
};
