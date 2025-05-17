const PaymentConfig = require('../models/PaymentConfig');

// Get payment config for frontend forms
exports.getPaymentConfig = async (req, res) => {
  try {
    const config = await PaymentConfig.findOne();
    if (!config) return res.status(404).json({ message: 'No payment config found' });
    res.status(200).json(config);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payment config' });
  }
};

// Product Admin updates dynamic payment options
exports.updatePaymentConfig = async (req, res) => {
  try {
    let config = await PaymentConfig.findOne();
    if (!config) {
      config = new PaymentConfig(req.body);
    } else {
      Object.assign(config, req.body);
    }
    await config.save();
    res.status(200).json({ message: 'Payment config updated successfully', config });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update config' });
  }
};

// Main Admin updates primary company account
exports.updatePrimaryAccount = async (req, res) => {
  try {
    const config = await PaymentConfig.findOne();
    if (!config) return res.status(404).json({ message: 'No config found' });

    config.primaryAccount = req.body;
    await config.save();
    res.status(200).json({ message: 'Primary account updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update primary account' });
  }
};
