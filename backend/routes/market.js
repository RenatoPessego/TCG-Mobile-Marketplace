const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/sell', verifyToken, marketController.sellCard);
router.post('/buy/:id', verifyToken, marketController.buyCard);
router.get('/', verifyToken, marketController.getMarketListings);
router.get('/mycards', verifyToken, marketController.getUserCards);
router.get('/mylistings', verifyToken, marketController.getMyListings);
router.delete('/:id', verifyToken, marketController.deleteListing);
router.put('/:id', verifyToken, marketController.updateListing);

module.exports = router;
