const mongoose = require('mongoose');

const manufacturerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: { type: String, required: true },
  registrationNumber: String,
  gstin: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  yearEstablished: Number,
  employeeCount: String,
  productionCapacity: String,
  specializations: [String],
  certifications: [String],
  exportExperience: { type: Boolean, default: false },
  exportCountries: [String],
  factoryImages: [String],
  logoUrl: String,
  website: String,
  description: String,
  isVerified: { type: Boolean, default: false },
  verificationBadge: {
    type: String,
    enum: ['none', 'basic', 'premium'],
    default: 'none'
  },
  verificationDate: Date,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  responseRate: Number,
  avgResponseTime: Number,
}, { timestamps: true });

module.exports = mongoose.model('ManufacturerProfile', manufacturerProfileSchema);
