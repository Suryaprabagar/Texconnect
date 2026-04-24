const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} = require('../controllers/products.controller');
const { auth, authorize } = require('../middleware/auth');

const upload = require('../middleware/upload');

const router = express.Router();

// Protected routes
router.use(auth);
router.get('/me', getMyProducts);

// Public routes (after protected /me to avoid shadowing)
router.get('/', getProducts);
router.get('/:id', getProduct);

router.post('/', authorize('manufacturer', 'admin'), upload.array('images', 5), createProduct);
router.put('/:id', authorize('manufacturer', 'admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', authorize('manufacturer', 'admin'), deleteProduct);

module.exports = router;
