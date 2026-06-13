// Description: Controller for managing market listings, including selling, buying, and updating cards.
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'digimonSecretKey123';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // remove "Bearer"

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // decoded = { id: '...' }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = verifyToken;
