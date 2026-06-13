const User = require('../models/User');
const fetch = require('node-fetch');

// Helper: selects a card randomly based on weighted rarity
function weightedRandom(items) {
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
  let rand = Math.random() * totalWeight;
  for (const item of items) {
    rand -= item.weight || 1;
    if (rand <= 0) return item.card;
  }
  return items[0].card;
}

// Open a real YGOProDeck pack using set code (e.g. "LOB")
exports.openPack = async (req, res) => {
  try {
    const userId = req.user.id;
    const packCode = req.params.id; // e.g. "LOB"
    const PACK_SIZE = 9;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=${encodeURIComponent(packCode)}`);
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      return res.status(404).json({ message: 'No cards found for this set' });
    }

    const allCards = data.data;

    // Apply rarity weights
    const weightedCards = allCards.map((card) => {
      const rarityStr = card.card_sets?.[0]?.set_rarity?.toLowerCase() || 'common';
      let weight = 1;
      if (rarityStr.includes('ultra')) weight = 0.5;
      else if (rarityStr.includes('super')) weight = 1;
      else if (rarityStr.includes('rare')) weight = 2;
      else weight = 5; // default for common/unknown
      return { card, weight };
    });

    const selected = [];
    for (let i = 0; i < PACK_SIZE; i++) {
      const chosen = weightedRandom(weightedCards);
      selected.push(chosen);

      const rarityFromSet = chosen.card_sets?.[0]?.set_rarity || '';
      const finalRarity = rarityFromSet || chosen.rarity || 'Unknown';

      // Check if card already exists in user collection (same id, rarity, packSource)
      const exists = user.cards.find(c =>
        c.id === chosen.id.toString() &&
        c.rarity === finalRarity &&
        c.packSource === packCode
      );

      if (exists) {
        exists.quantity += 1;
      } else {
        user.cards.push({
          id: chosen.id.toString(),
          quantity: 1,
          rarity: finalRarity,
          packSource: packCode
        });
      }
    }

    await user.save();

    // Prepare response
    const resultCards = selected.map((card) => {
      const image = card.card_images?.[0]?.image_url || null;
      const rarityFromSet = card.card_sets?.[0]?.set_rarity || '';
      const baseRarity = card.rarity || '';
      const fullRarity = rarityFromSet && baseRarity
        ? `${rarityFromSet} (${baseRarity})`
        : rarityFromSet || baseRarity || 'Unknown';

      return {
        id: card.id.toString(),
        name: card.name,
        image_url: image,
        rarity: fullRarity,
        packSource: packCode
      };
    });

    return res.status(200).json({ cards: resultCards });
  } catch (err) {
    console.error('❌ Error opening pack:', err.message);
    return res.status(500).json({ message: 'Server error while opening pack' });
  }
};

// Quick Sell: Sell 1 card by ID and add price to user balance
exports.quickSellCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cardId, price, rarity, pack } = req.body;

    if (!cardId || !price || !rarity || !pack) {
      return res.status(400).json({ message: 'Missing cardId, price, rarity or pack' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find the card by ID, rarity and packSource
    const cardIndex = user.cards.findIndex(c =>
      c.id === cardId &&
      c.rarity === rarity &&
      c.pack === pack
    );

    if (cardIndex === -1) {
      return res.status(404).json({ message: 'Card not found in inventory' });
    }

    const card = user.cards[cardIndex];

    if (card.quantity < 1) {
      return res.status(400).json({ message: 'Insufficient quantity to sell' });
    }

    card.quantity -= 1;

    if (card.quantity === 0) {
      user.cards.splice(cardIndex, 1); // Remove the card if quantity reaches 0
    }

    user.balance += parseFloat(price);
    await user.save();

    return res.status(200).json({ user });
  } catch (err) {
    console.error('❌ Error in quick sell:', err.message);
    return res.status(500).json({ message: 'Server error during quick sell' });
  }
};
