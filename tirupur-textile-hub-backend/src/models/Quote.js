const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
  manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  manufacturerProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'ManufacturerProfile' },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  quantity: Number,
  leadTime: Number, // days
  sampleCost: Number,
  fabricDetails: String,
  productionCapability: String,
  validUntil: Date,
  termsAndConditions: String,
  attachments: [String],
  message: String,
  status: {
    type: String,
    enum: ['pending', 'viewed', 'accepted', 'rejected', 'expired'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);
