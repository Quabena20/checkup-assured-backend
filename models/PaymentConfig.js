const mongoose = require('mongoose');

const PaymentConfigSchema = new mongoose.Schema({
  paymentModes: [String], // e.g., ["Mobile Money", "Bank Transfer", "Card"]
  momoNetworks: [String], // e.g., ["MTN", "Vodafone", "AirtelTigo"]
  banks: [String],        // e.g., ["GCB", "Fidelity", "Stanbic"]
  primaryAccount: {
    accountType: String,   // "Bank" or "MoMo"
    accountName: String,
    accountNumber: String,
    provider: String       // e.g., GCB, MTN
  }
}, { timestamps: true });

module.exports = mongoose.model('PaymentConfig', PaymentConfigSchema);
