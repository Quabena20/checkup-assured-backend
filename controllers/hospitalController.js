const User = require('../models/User');
const Claim = require('../models/Claim');

exports.verifyClient = async (req, res) => {
  const { ghanaCard } = req.body;
  try {
    const client = await User.findOne({ ghanaCard, role: 'client' });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.status(200).json({
      name: client.fullName,
      faceImage: client.faceImage,
      packageSelected: client.packageSelected,
      active: client.active
    });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed' });
  }
};

exports.updateTestServices = async (req, res) => {
  try {
    const hospital = await User.findById(req.user._id);
    hospital.testServices = req.body.testServices;
    await hospital.save();
    res.status(200).json({ message: 'Test services updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update tests' });
  }
};

exports.submitClaim = async (req, res) => {
  try {
    const { clientId, packageUsed, amount } = req.body;

    const claim = new Claim({
      hospitalId: req.user._id,
      clientId,
      packageUsed,
      amount,
      submittedAt: new Date()
    });

    await claim.save();
    res.status(200).json({ message: 'Claim submitted for approval' });
  } catch (err) {
    res.status(500).json({ message: 'Claim submission failed' });
  }
};
