const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);

router.post('/:recipientId', messageController.sendMessage);
router.get('/:userId', messageController.getConversation);

module.exports = router;