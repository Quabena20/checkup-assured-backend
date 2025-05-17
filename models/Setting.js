const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  primaryAccount: {
    bankName: String,
    accountNumber: String,
    accountHolder: String
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: Date
});

module.exports = mongoose.model('Setting', settingSchema);
