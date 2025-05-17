const Commission = require('../models/Commission');
const User = require('../models/User');

// GENERATE MONTHLY COMMISSIONS
exports.generateMonthlyCommissions = async (req, res) => {
  try {
    const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const reps = await User.find({ role: 'salesRep' });

    for (const rep of reps) {
      const clients = await User.find({
        registeredBy: rep._id,
        role: 'client',
        active: true,
        isChild: false
      });

      for (const client of clients) {
        const exists = await Commission.findOne({ repId: rep._id, clientId: client._id, month });
        if (!exists) {
          await Commission.create({
            repId: rep._id,
            clientId: client._id,
            amount: 5, // Default commission GH¢5
            month
          });
        }
      }
    }

    res.status(200).json({ message: `Commissions for ${month} generated` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate commissions' });
  }
};

// PAY COMMISSION TO REP
exports.payRepCommission = async (req, res) => {
  try {
    const { repId, month } = req.body;

    const commissions = await Commission.find({ repId, month, paid: false });
    if (commissions.length === 0) {
      return res.status(400).json({ message: 'No unpaid commissions found' });
    }

    const total = commissions.reduce((sum, c) => sum + c.amount, 0);

    // TODO: Paystack payout here (simulated)
    for (let c of commissions) {
      c.paid = true;
      c.paidAt = new Date();
      await c.save();
    }

    res.status(200).json({
      message: `GH¢${total} paid to rep`,
      count: commissions.length,
      total
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to pay commission' });
  }
};

// REP VIEWS OWN COMMISSIONS
exports.getMyCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find({ repId: req.user._id }).populate('clientId', 'fullName');
    res.status(200).json(commissions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch commissions' });
  }
};
