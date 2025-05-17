const mongoose = require('mongoose');

const constantsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  note: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Constants', constantsSchema);
