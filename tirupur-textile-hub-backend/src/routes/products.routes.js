const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products.controller');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(auth);
router.post('/', authorize('manufacturer', 'admin'), createProduct);
router.put('/:id', authorize('manufacturer', 'admin'), updateProduct);
router.delete('/:id', authorize('manufacturer', 'admin'), deleteProduct);

module.exports = router;
