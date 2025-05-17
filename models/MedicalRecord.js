const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visitDate: { type: Date, default: Date.now },
  packageUsed: String,
  testResults: String,
  diagnosisNotes: String
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
