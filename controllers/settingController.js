const Setting = require('../models/Setting');

// MAIN ADMIN sets the primary account
exports.setPrimaryAccount = async (req, res) => {
  try {
    const { bankName, accountNumber, accountHolder } = req.body;

    const existing = await Setting.findOne();
    if (existing) {
      existing.primaryAccount = { bankName, accountNumber, accountHolder };
      existing.updatedBy = req.user._id;
      existing.updatedAt = new Date();
      await existing.save();
    } else {
      await Setting.create({
        primaryAccount: { bankName, accountNumber, accountHolder },
        updatedBy: req.user._id,
        updatedAt: new Date()
      });
    }

    res.status(200).json({ message: 'Primary account updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update primary account' });
  }
};

// ANYONE can view it (for verification)
exports.getPrimaryAccount = async (req, res) => {
  try {
    const setting = await Setting.findOne();
    res.status(200).json(setting?.primaryAccount || {});
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch primary account' });
  }
};
