const express = require('express');
const { getBuyerProfile, upsertBuyerProfile } = require('../controllers/profile.controller');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, authorize('buyer', 'admin'), getBuyerProfile);
router.post('/profile', auth, authorize('buyer', 'admin'), upsertBuyerProfile);

module.exports = router;
