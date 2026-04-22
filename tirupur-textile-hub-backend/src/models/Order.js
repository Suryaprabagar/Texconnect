const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ' },
  quoteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: {
    type: String,
    enum: ['confirmed', 'in_production', 'quality_check', 'ready_to_ship', 'shipped', 'delivered', 'cancelled', 'disputed'],
    default: 'confirmed'
  },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  expectedDelivery: Date,
  actualDelivery: Date,
  trackingNumber: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentTerms: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
