const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  rarity: { type: String },
  pack: { type: String },
});

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  birthDate: Date,
  balance: { type: Number, default: 0 },
  profileImage: String,
  cards: [cardSchema],
  pushToken: { type: String },
  checkInHistory: [
  {
    location: String,
    date: Date
  }
],
});

module.exports = mongoose.model('User', userSchema);
