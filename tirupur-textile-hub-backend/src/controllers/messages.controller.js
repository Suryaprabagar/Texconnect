const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Start / Get conversation between two users
// @route   POST /api/v1/messages/conversations
// @access  Private
// @desc    Start / Get conversation between two users
// @route   POST /api/v1/messages/conversations
// @access  Private
exports.getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId, subject, rfqId, productId } = req.body;
    
    // Find existing conversation between these participants first
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] }
    }).populate('participants', 'name email');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
        subject: subject || 'New Inquiry',
        rfqId,
        productId,
        lastMessageAt: Date.now()
      });
      conversation = await conversation.populate('participants', 'name email');
    } else {
      // Update context references if new ones were provided
      let updated = false;
      if (rfqId && (!conversation.rfqId || conversation.rfqId.toString() !== rfqId.toString())) {
        conversation.rfqId = rfqId;
        updated = true;
      }
      if (productId && (!conversation.productId || conversation.productId.toString() !== productId.toString())) {
        conversation.productId = productId;
        updated = true;
      }
      if (subject && conversation.subject !== subject) {
        conversation.subject = subject;
        updated = true;
      }
      if (updated) {
        await conversation.save();
      }
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

    // Set no-cache to ensure inbox is always fresh
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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

    // Update conversation last message and increment unread for other participants
    conversation.lastMessage = content;
    conversation.lastMessageAt = Date.now();
    
    // Increment unread count for everyone except sender
    conversation.participants.forEach(participantId => {
      if (participantId.toString() !== req.user._id.toString()) {
        const currentCount = conversation.unreadCount.get(participantId.toString()) || 0;
        conversation.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

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

    // Clear unread count for this user
    const currentUnread = conversation.unreadCount.get(req.user._id.toString()) || 0;
    if (currentUnread > 0) {
      conversation.unreadCount.set(req.user._id.toString(), 0);
      await conversation.save();
    }

    const messages = await Message.find({
      conversationId: req.params.id
    }).sort({ createdAt: 1 });

    // Force no-cache for message list
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return apiResponse(res, 200, true, 'Messages fetched', { messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a conversation and all its messages
// @route   DELETE /api/v1/messages/conversations/:id
// @access  Private
exports.deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return apiResponse(res, 404, false, 'Conversation not found');

    if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
      return apiResponse(res, 403, false, 'Not authorized to delete this conversation');
    }

    // Delete all messages in this conversation
    await Message.deleteMany({ conversationId: req.params.id });

    // Delete the conversation
    await conversation.deleteOne();

    return apiResponse(res, 200, true, 'Conversation deleted successfully');
  } catch (error) {
    next(error);
  }
};

