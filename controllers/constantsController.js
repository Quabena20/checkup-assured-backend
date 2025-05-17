const Constants = require('../models/Constants');

// FINANCIAL ADMIN sets cost constant
exports.setCostConstant = async (req, res) => {
  try {
    const { value } = req.body;

    let constant = await Constants.findOne();
    if (constant) {
      constant.costConstant = value;
      constant.updatedBy = req.user._id;
      constant.updatedAt = new Date();
      await constant.save();
    } else {
      await Constants.create({
        costConstant: value,
        updatedBy: req.user._id,
        updatedAt: new Date()
      });
    }

    res.status(200).json({ message: 'Cost constant updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// Get cost constant
exports.getCostConstant = async (req, res) => {
  try {
    const constant = await Constants.findOne();
    res.status(200).json({ costConstant: constant?.costConstant || 1 });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch constant' });
  }
};
