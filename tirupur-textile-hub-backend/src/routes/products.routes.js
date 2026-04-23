const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products.controller');
const { auth, authorize } = require('../middleware/auth');

const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(auth);
router.post('/', authorize('manufacturer', 'admin'), upload.array('images', 5), createProduct);
router.put('/:id', authorize('manufacturer', 'admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', authorize('manufacturer', 'admin'), deleteProduct);

module.exports = router;
