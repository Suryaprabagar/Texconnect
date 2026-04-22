const mongoose = require('mongoose');

const priceBracketSchema = new mongoose.Schema({
  minQty: { type: Number, required: true },
  maxQty: { type: Number },
  pricePerUnit: { type: Number, required: true }
});

const productSchema = new mongoose.Schema({
  manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ManufacturerProfile', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  category: {
    type: String,
    enum: ['tshirt', 'hoodie', 'kidswear', 'polo', 'formal', 'sportswear', 'innerwear', 'ethnic', 'denim', 'jacket', 'other'],
    required: true
  },
  description: { type: String },
  fabricType: { type: String },
  fabricComposition: { type: String },
  gsm: { type: Number },
  availableSizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom'] }],
  colors: [String],
  moq: { type: Number, required: true, min: 1 },
  pricePerUnit: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  priceBrackets: [priceBracketSchema],
  leadTime: { type: Number },
  customizationAvailable: { type: Boolean, default: false },
  customizationOptions: [String],
  images: [String],
  tags: [String],
  sampleAvailable: { type: Boolean, default: false },
  sampleCost: { type: Number },
  status: { type: String, enum: ['active', 'inactive', 'out_of_stock', 'draft'], default: 'draft' },
  views: { type: Number, default: 0 },
  inquiryCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-generate slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  }
  next();
});

// Text search index
productSchema.index({ name: 'text', description: 'text', tags: 'text', fabricType: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ manufacturerId: 1 });
productSchema.index({ pricePerUnit: 1 });

module.exports = mongoose.model('Product', productSchema);
