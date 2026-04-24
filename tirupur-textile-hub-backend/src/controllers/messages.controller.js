const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Start / Get conversation between two users
// @route   POST /api/v1/messages/conversations
// @access  Private
exports.getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId, subject, rfqId, productId } = req.body;
    
    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
      rfqId,
      productId
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
        subject,
        rfqId,
        productId
      });
    }

    return apiResponse(res, 200, true, 'Conversation fetched', { conversation });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations for user
// @route   GET /api/v1/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] }
    }).populate('participants', 'name email').sort({ lastMessageAt: -1 });

    return apiResponse(res, 200, true, 'Conversations fetched', { conversations });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/v1/messages/conversations/:id/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { content, type, metadata } = req.body;
    const conversationId = req.params.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return apiResponse(res, 404, false, 'Conversation not found');

    if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
      return apiResponse(res, 403, false, 'Not authorized to send message in this conversation');
    }

    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      content,
      type: type || 'text',
      metadata
    });

    // Update conversation last message
    conversation.lastMessage = content;
    conversation.lastMessageAt = Date.now();
    await conversation.save();

    return apiResponse(res, 201, true, 'Message sent', { message });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/v1/messages/conversations/:id/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return apiResponse(res, 404, false, 'Conversation not found');

    if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
      return apiResponse(res, 403, false, 'Not authorized to view messages in this conversation');
    }

    const messages = await Message.find({
      conversationId: req.params.id
    }).sort({ createdAt: 1 });

    return apiResponse(res, 200, true, 'Messages fetched', { messages });
  } catch (error) {
    next(error);
  }
};
