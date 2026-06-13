const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardId: { type: String, required: true },
  rarity: { type: String, required: true },
  pack: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  datePosted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MarketListing', marketSchema);
