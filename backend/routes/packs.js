const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const packsController = require('../controllers/packsController');

router.post('/generate', verifyToken, packsController.generatePacks);
router.post('/open', verifyToken, packsController.openPack);

module.exports = router;
