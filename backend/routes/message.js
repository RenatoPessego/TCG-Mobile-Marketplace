const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, messageController.sendMessage);
router.get('/participants/:listingId', verifyToken, messageController.getParticipants);
router.get('/:listingId/:userId', verifyToken, messageController.getMessages);

module.exports = router;
