const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const cardsController = require('../controllers/cardsController');

router.post('/open-pack/:id', verifyToken, cardsController.openPack);
router.post('/quick-sell', verifyToken, cardsController.quickSellCard);

module.exports = router;
