const Claim = require('../models/Claim');
const User = require('../models/User');

// Hospital submits a claim
exports.submitClaim = async (req, res) => {
  try {
    const { ghanaCard, packageUsed, testSummary, amount } = req.body;

    const client = await User.findOne({ ghanaCard });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const claim = new Claim({
      clientId: client._id,
      hospitalId: req.user._id,
      packageUsed,
      testSummary,
      amount
    });

    await claim.save();
    res.status(201).json({ message: 'Claim submitted', claim });
  } catch (err) {
    res.status(500).json({ message: 'Claim submission failed' });
  }
};

// Financial Admin reviews (approve/reject)
exports.reviewClaim = async (req, res) => {
  try {
    const { claimId, action } = req.body;
    const status = action === 'approve' ? 'approved' : 'rejected';

    const claim = await Claim.findById(claimId);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });

    claim.status = status;
    claim.reviewedAt = new Date();
    claim.reviewedBy = req.user._id;

    await claim.save();
    res.status(200).json({ message: `Claim ${status}`, claim });
  } catch (err) {
    res.status(500).json({ message: 'Review failed' });
  }
};

// View claims (for hospital or financial admin)
exports.getClaims = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'hospital') {
      filter.hospitalId = req.user._id;
    }

    const claims = await Claim.find(filter)
      .populate('clientId', 'fullName ghanaCard')
      .populate('reviewedBy', 'fullName email')
      .sort({ submittedAt: -1 });

    res.status(200).json(claims);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch claims' });
  }
};
