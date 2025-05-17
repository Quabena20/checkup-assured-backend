const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageUsed: String,
  testSummary: String,
  amount: Number,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // ✅ Payout fields (Phase 17)
  paid: { type: Boolean, default: false },
  paidAt: Date
});

module.exports = mongoose.model('Claim', ClaimSchema);
