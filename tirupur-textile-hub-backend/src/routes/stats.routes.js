const express = require('express');
const router = express.Router();
const { getGlobalStats } = require('../controllers/stats.controller');

router.get('/summary', getGlobalStats);

module.exports = router;
