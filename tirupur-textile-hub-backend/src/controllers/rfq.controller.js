const RFQ = require('../models/RFQ');
const Quote = require('../models/Quote');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Create RFQ
// @route   POST /api/v1/rfqs
// @access  Private (Buyer)
exports.createRFQ = async (req, res, next) => {
  try {
    const rfqNumber = 'RFQ-' + Date.now().toString().slice(-6); // Simple random RFQ number
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (req.body.expiryDays || 30));

    const rfq = await RFQ.create({
      ...req.body,
      rfqNumber,
      buyerId: req.user.id,
      expiryDate,
      status: 'open'
    });

    return apiResponse(res, 201, true, 'RFQ created successfully', { rfq });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all RFQs (filtered for buyers)
// @route   GET /api/v1/rfqs
// @access  Public/Private
exports.getRFQs = async (req, res, next) => {
  try {
    let query = { status: 'open' };
    
    // If user is authenticated and is a buyer, show their RFQs (including non-open ones if needed)
    // For now, let's just filter open ones for manufacturers, and own ones for buyers
    if (req.user && req.user.role === 'buyer') {
      query = { buyerId: req.user.id };
    }

    const rfqs = await RFQ.find(query).populate('buyerId', 'name').sort({ createdAt: -1 });
    return apiResponse(res, 200, true, 'RFQs fetched', { rfqs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single RFQ
// @route   GET /api/v1/rfqs/:id
// @access  Private
exports.getRFQ = async (req, res, next) => {
  try {
    const rfq = await RFQ.findById(req.params.id).populate('buyerId', 'name email');
    if (!rfq) {
      return apiResponse(res, 404, false, 'RFQ not found');
    }
    return apiResponse(res, 200, true, 'RFQ details fetched', { rfq });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quote for an RFQ
// @route   POST /api/v1/quotes
// @access  Private (Manufacturer)
exports.submitQuote = async (req, res, next) => {
  try {
    const { rfqId, pricePerUnit, quantity, message } = req.body;
    
    const rfq = await RFQ.findById(rfqId);
    if (!rfq) return apiResponse(res, 404, false, 'RFQ not found');

    const quote = await Quote.create({
      rfqId,
      manufacturerId: req.user.id,
      buyerId: rfq.buyerId,
      pricePerUnit,
      quantity,
      totalAmount: pricePerUnit * quantity,
      message,
      status: 'pending'
    });

    // Update RFQ quote count
    rfq.quoteCount += 1;
    await rfq.save();

    return apiResponse(res, 201, true, 'Quote submitted successfully', { quote });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quotes for an RFQ
// @route   GET /api/v1/quotes/rfq/:rfqId
// @access  Private (Buyer/Owner)
exports.getQuotesForRFQ = async (req, res, next) => {
  try {
    const rfq = await RFQ.findById(req.params.rfqId);
    if (!rfq) return apiResponse(res, 404, false, 'RFQ not found');
    
    if (rfq.buyerId.toString() !== req.user.id) {
      return apiResponse(res, 403, false, 'Not authorized to view quotes for this RFQ');
    }

    const quotes = await Quote.find({ rfqId: req.params.rfqId }).populate('manufacturerId', 'name email');
    return apiResponse(res, 200, true, 'Quotes fetched', { quotes });
  } catch (error) {
    next(error);
  }
};
