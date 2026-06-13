const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.put('/pushtoken', verifyToken, userController.pushToken);
router.post('/checkin', verifyToken, userController.checkin);

module.exports = router;