const express = require('express');
const { getOrCreateConversation, getConversations, sendMessage, getMessages } = require('../controllers/messages.controller');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/conversations', getConversations);
router.post('/conversations', getOrCreateConversation);
router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);

module.exports = router;
