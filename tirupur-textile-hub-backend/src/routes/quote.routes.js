const express = require('express');
const { submitQuote, getQuotesForRFQ } = require('../controllers/rfq.controller');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, authorize('manufacturer', 'admin'), submitQuote);
router.get('/rfq/:rfqId', auth, authorize('buyer', 'admin'), getQuotesForRFQ);

module.exports = router;
