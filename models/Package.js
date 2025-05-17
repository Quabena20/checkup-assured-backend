const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: String,
  description: String,
  basePrice: Number,
  testsIncluded: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: Date
});

module.exports = mongoose.model('Package', packageSchema);
