const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');

// Hospital adds record for a client (includes staff and children)
exports.addMedicalRecord = async (req, res) => {
  try {
    const { clientId, packageUsed, testResults, diagnosisNotes } = req.body;

    const client = await User.findById(clientId);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const record = new MedicalRecord({
      clientId,
      hospitalId: req.user._id,
      packageUsed,
      testResults,
      diagnosisNotes
    });

    await record.save();
    res.status(201).json({ message: 'Medical record saved', record });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save record' });
  }
};

// Clients, guardians, or hospitals view history
exports.getMedicalHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const isGuardian = req.query.childId;
    const targetId = isGuardian ? req.query.childId : userId;

    const records = await MedicalRecord.find({ clientId: targetId }).populate('hospitalId', 'fullName location');
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch medical history' });
  }
};
