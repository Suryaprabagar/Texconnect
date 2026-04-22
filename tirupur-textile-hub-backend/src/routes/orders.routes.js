const express = require('express');
const { createOrder, getOrders, updateOrderStatus, submitReview } = require('../controllers/orders.controller');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getOrders);
router.post('/', authorize('buyer', 'admin'), createOrder);
router.put('/:id/status', authorize('manufacturer', 'admin'), updateOrderStatus);
router.post('/:id/review', authorize('buyer', 'admin'), submitReview);

module.exports = router;
