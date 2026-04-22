const express = require('express');
const { getManufacturers, getManufacturerProfile, upsertManufacturerProfile } = require('../controllers/profile.controller');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getManufacturers);
router.get('/:id', getManufacturerProfile);
router.post('/profile', auth, authorize('manufacturer', 'admin'), upsertManufacturerProfile);

module.exports = router;
