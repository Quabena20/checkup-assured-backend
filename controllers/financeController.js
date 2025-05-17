const Constants = require('../models/Constants');

exports.getConstant = async (req, res) => {
  try {
    const constant = await Constants.findOne().sort({ createdAt: -1 });
    if (!constant) return res.status(404).json({ message: 'No constant found' });
    res.status(200).json(constant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve constant' });
  }
};

exports.setConstant = async (req, res) => {
  try {
    const { amount, note } = req.body;
    if (!amount || isNaN(amount)) return res.status(400).json({ message: 'Valid amount is required' });

    const newConstant = await Constants.create({
      amount,
      note,
      updatedBy: req.user._id
    });

    res.status(201).json({ message: 'Constant updated', constant: newConstant });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update constant' });
  }
};
