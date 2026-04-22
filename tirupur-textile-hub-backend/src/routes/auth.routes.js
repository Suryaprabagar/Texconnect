const express = require('express');
const { register, login, getMe, logout } = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

module.exports = router;
