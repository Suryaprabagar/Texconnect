const mongoose = require('mongoose');

const buyerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: { type: String, required: true },
  buyerType: {
    type: String,
    enum: ['retailer', 'wholesaler', 'exporter', 'brand', 'individual'],
    default: 'individual'
  },
  gstin: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  preferredCategories: [String],
  annualPurchaseVolume: String,
  logoUrl: String,
  website: String,
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('BuyerProfile', buyerProfileSchema);
