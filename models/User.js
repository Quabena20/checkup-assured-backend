const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,

  // Identification
  ghanaCardNumber: String,
  passportPhoto: String,
  faceImage: String,
  documents: [String], // certificates, CVs, etc.

  // Location and Contact
  phoneNumber: String,
  residence: String,

  // Role
  role: {
    type: String,
    enum: ['client', 'salesRep', 'company', 'hospital', 'mainAdmin', 'productAdmin', 'systemAdmin', 'financialAdmin', 'customerServiceAdmin'],
    required: true
  },

  // Registration Links
  isStaff: { type: Boolean, default: false },
  isChild: { type: Boolean, default: false },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Sales Rep
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },    // Company
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },     // Guardian

  // Account Status
  active: { type: Boolean, default: false },
  paymentStatus: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
  lastPaymentDate: Date,

  // Payment Info
  paymentMode: {
    type: String,
    enum: ['Mobile Money', 'Bank Transfer', 'Visa/MasterCard'],
    default: 'Mobile Money'
  },
  paymentDetails: {
    mobileNetwork: String,
    momoNumber: String,
    bankName: String,
    accountNumber: String,
    accountHolder: String
  },

  // Package & Premium
  packageSelected: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  paymentFrequency: {
    type: String,
    enum: ['annual', 'biannual', 'quarterly'],
    default: 'annual'
  },
  calculatedPremium: Number,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
