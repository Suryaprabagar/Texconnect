const express = require('express');
const { createRFQ, getRFQs } = require('../controllers/rfq.controller');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getRFQs);
router.post('/', auth, authorize('buyer', 'admin'), createRFQ);

module.exports = router;
