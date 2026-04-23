const express = require('express');
const { createRFQ, getRFQs, getRFQ } = require('../controllers/rfq.controller');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getRFQs);
router.get('/:id', auth, getRFQ);
router.post('/', auth, authorize('buyer', 'admin'), createRFQ);

module.exports = router;
