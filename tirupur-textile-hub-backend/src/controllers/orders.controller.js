const Order = require('../models/Order');
const Review = require('../models/Review');
const { apiResponse } = require('../utils/apiResponse');

// @desc    Create order (usually from accepted quote)
// @route   POST /api/v1/orders
// @access  Private (Buyer)
exports.createOrder = async (req, res, next) => {
  try {
    const orderNumber = 'ORD-' + Date.now().toString().slice(-6);
    const order = await Order.create({
      ...req.body,
      orderNumber,
      buyerId: req.user.id,
      timeline: [{ status: 'confirmed', note: 'Order placed' }]
    });

    return apiResponse(res, 201, true, 'Order created successfully', { order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (for buyer or manufacturer)
// @route   GET /api/v1/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === 'buyer' 
      ? { buyerId: req.user.id } 
      : { manufacturerId: req.user.id };

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return apiResponse(res, 200, true, 'Orders fetched', { orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Manufacturer)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return apiResponse(res, 404, false, 'Order not found');
    
    // Check manufacturer authorization
    if (order.manufacturerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return apiResponse(res, 403, false, 'Not authorized to update this order');
    }

    order.status = status;
    order.timeline.push({ status, note, updatedBy: req.user.id });
    await order.save();

    return apiResponse(res, 200, true, 'Order status updated', { order });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit review for an order
// @route   POST /api/v1/orders/:id/review
// @access  Private (Buyer)
exports.submitReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return apiResponse(res, 404, false, 'Order not found');
    if (order.buyerId.toString() !== req.user.id) {
      return apiResponse(res, 403, false, 'Only buyers can review their orders');
    }

    const review = await Review.create({
      orderId: order._id,
      reviewerId: req.user.id,
      revieweeId: order.manufacturerId,
      rating,
      title,
      comment
    });

    return apiResponse(res, 201, true, 'Review submitted successfully', { review });
  } catch (error) {
    next(error);
  }
};
