const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  subject: String,
  lastMessage: String,
  lastMessageAt: Date,
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
