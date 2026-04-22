const mongoose = require('mongoose');

const rfqSchema = new mongoose.Schema({
  rfqNumber: { type: String, unique: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuyerProfile' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ManufacturerProfile' },
  title: { type: String, required: true },
  category: String,
  description: String,
  requiredQuantity: { type: Number, required: true },
  targetPricePerUnit: Number,
  currency: { type: String, default: 'INR' },
  requiredSizes: [String],
  requiredColors: [String],
  fabricPreferences: String,
  gsmRequirement: Number,
  customizationNeeded: { type: Boolean, default: false },
  customizationDetails: String,
  sampleRequired: { type: Boolean, default: false },
  deliveryDeadline: Date,
  deliveryAddress: String,
  attachments: [String],
  status: {
    type: String,
    enum: ['open', 'quoted', 'accepted', 'rejected', 'expired', 'closed'],
    default: 'open'
  },
  expiryDate: Date,
  quoteCount: { type: Number, default: 0 },
  selectedQuoteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
}, { timestamps: true });

module.exports = mongoose.model('RFQ', rfqSchema);
