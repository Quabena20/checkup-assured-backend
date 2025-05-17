const axios = require('axios');
const Claim = require('../models/Claim');
const User = require('../models/User');

// PAY OUT TO HOSPITAL FOR APPROVED CLAIM
exports.payHospital = async (req, res) => {
  try {
    const { claimId } = req.body;

    const claim = await Claim.findById(claimId).populate('hospitalId');
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    if (claim.status !== 'approved') return res.status(400).json({ message: 'Claim not approved' });
    if (claim.paid) return res.status(400).json({ message: 'Claim already paid' });

    const hospital = claim.hospitalId;
    const { paymentDetails, paymentMode } = hospital;

    if (!paymentDetails || !paymentDetails.accountNumber) {
      return res.status(400).json({ message: 'Hospital payment details incomplete' });
    }

    // INITIATE PAYSTACK TRANSFER (Simulated)
    const transferRes = await axios.post(
      'https://api.paystack.co/transfer',
      {
        source: 'balance',
        amount: claim.amount * 100, // convert to pesewas
        recipient: paymentDetails.accountNumber,
        reason: `Claim payout for ${hospital.fullName}`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
        }
      }
    );

    if (!transferRes.data.status) {
      return res.status(400).json({ message: 'Transfer failed' });
    }

    claim.paid = true;
    claim.paidAt = new Date();
    await claim.save();

    res.status(200).json({ message: 'Claim paid successfully', claim });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Hospital payout failed' });
  }
};
