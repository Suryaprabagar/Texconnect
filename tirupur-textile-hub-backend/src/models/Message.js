const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  attachments: [String],
  type: {
    type: String,
    enum: ['text', 'image', 'document', 'quote_card'],
    default: 'text'
  },
  metadata: {
    rfqId: mongoose.Schema.Types.ObjectId,
    quoteId: mongoose.Schema.Types.ObjectId
  },
  isRead: { type: Boolean, default: false },
  readAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
