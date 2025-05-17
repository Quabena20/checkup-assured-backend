const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: String,
  ghanaCard: String,
  faceImage: String,
  guardianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageSelected: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  },
  frequency: {
    type: String,
    enum: ['annual', 'biannual', 'quarterly'],
    default: 'annual'
  },
  premium: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Child', childSchema);
