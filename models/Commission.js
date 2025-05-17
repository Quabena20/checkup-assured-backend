const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  repId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  month: String, // Example: 'May-2025'
  paid: { type: Boolean, default: false },
  paidAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Commission', commissionSchema);
