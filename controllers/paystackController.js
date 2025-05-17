const axios = require('axios');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Initiate transaction
exports.initializePayment = async (req, res) => {
  try {
    const { amount, email } = req.body;
    const reference = `CHK-${Date.now()}`;

    const user = await User.findById(req.user._id);
    if (user.isStaff) return res.status(403).json({ message: 'Staff payments are handled by company.' });
    if (user.isChild) return res.status(403).json({ message: 'Children cannot pay directly. Parent must pay.' });

    const paystackRes = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: amount * 100,
        email,
        reference,
        currency: 'GHS',
        channels: ['card', 'mobile_money']
      },
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
      }
    );

    const transaction = new Transaction({
      userId: req.user._id,
      amount,
      reference,
      status: 'pending'
    });
    await transaction.save();

    res.status(200).json({
      message: 'Payment initialized',
      authorization_url: paystackRes.data.data.authorization_url,
      reference
    });
  } catch (err) {
    res.status(500).json({ message: 'Payment initialization failed' });
  }
};

// Verify transaction
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
    });

    const data = response.data.data;
    const transaction = await Transaction.findOne({ reference });

    if (data.status === 'success') {
      transaction.status = 'success';
      transaction.paidAt = new Date(data.paid_at);
      transaction.method = data.channel;
      await transaction.save();

      // Mark user active
      const user = await User.findById(transaction.userId);
      user.paymentStatus = 'active';
      user.lastPaymentDate = new Date();

      // Also activate child if this is a parent
      const children = await User.find({ parentId: user._id, isChild: true });
      for (let child of children) {
        child.paymentStatus = 'active';
        child.lastPaymentDate = new Date();
        await child.save();
      }

      await user.save();
    } else {
      transaction.status = 'failed';
      await transaction.save();
    }

    res.status(200).json({ message: `Payment ${data.status}`, status: data.status });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed' });
  }
};
