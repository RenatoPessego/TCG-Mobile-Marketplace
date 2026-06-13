const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

// Rarity profiles with weights and base prices
const rarityProfiles = {
  common: {
    name: 'Common',
    weights: { 'Common': 1.0 },
    price: 0,
  },
  rare: {
    name: 'Rare',
    weights: { 'Common': 0.7, 'Rare': 0.3 },
    price: 2,
  },
  super_rare: {
    name: 'Super Rare',
    weights: { 'Common': 0.5, 'Rare': 0.3, 'Ultra Rare': 0.2 },
    price: 4,
  },
  legendary: {
    name: 'Legendary',
    weights: { 'Common': 0.4, 'Rare': 0.3, 'Ultra Rare': 0.2, 'Secret Rare': 0.1 },
    price: 7,
  }
};

// Simple in-memory cache to reduce repeated fetches
const setCache = {};

// Helper to randomly select rarity based on weights
function getRandomRarity(weights) {
  const rand = Math.random();
  let acc = 0;
  for (const [rarity, weight] of Object.entries(weights)) {
    acc += weight;
    if (rand <= acc) return rarity;
  }
  return 'Common';
}

// Generating the packs
exports.generatePacks = async (req, res) => {
  try {
    const { rarityType, cardCount, packSource } = req.body;

    const rarity = rarityType || 'common';
    const count = parseInt(cardCount) || 1;
    const source = packSource || 'Default Set';
    
    const profile = rarityProfiles[rarity];
    if (!profile) return res.status(400).json({ message: 'Invalid rarity type' });
    
    const packs = Array.from({ length: 6 }).map(() => ({
      id: uuidv4(),
      name: `${source} - ${profile.name} x${count}`,
      rarity: rarity,
      cardCount: count,
      packSource: source,
      price: CalculatePrice(profile.price, count),
      imageUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/assets/generic-pack.png`
    }));

    res.status(200).json({ packs });
  } catch (err) {
    console.error('❌ Error generating packs:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
function CalculatePrice(profilePrice, count){
  tempPrice = 0;
  if(profilePrice == 0) tempPrice = 1;
  else tempPrice = profilePrice;
  const FinalPrice = profilePrice + (tempPrice * (count - 1));
  return FinalPrice;
}

// Open a pack
exports.openPack = async (req, res) => {
  try {
    const { rarity, cardCount, packSource } = req.body;
    const userId = req.user?.id;

    if (!rarity || !cardCount || !packSource || !userId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const profile = rarityProfiles[rarity];
    if (!profile) return res.status(400).json({ message: 'Invalid rarity type.' });

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    price = CalculatePrice(profile.price, cardCount);
    if (user.balance < price) {
      return res.status(402).json({ message: 'Insufficient balance.' });
    }
    else {
      user.balance -= price;
    }
    if (!setCache[packSource]) {
      const apiRes = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=${encodeURIComponent(packSource)}`);
      const data = await apiRes.json();
      if (!data?.data || data.data.length === 0) {
        return res.status(404).json({ message: 'No cards found for this pack source.' });
      }
      setCache[packSource] = data.data;
    }

    const allCards = setCache[packSource];
    const result = [];

    for (let i = 0; i < cardCount; i++) {
      const selectedRarity = getRandomRarity(profile.weights);

      const filtered = allCards.filter(c =>
        typeof c.rarity === 'string' &&
        c.rarity.toLowerCase().includes(selectedRarity.toLowerCase())
      );

      const chosen = filtered.length > 0
        ? filtered[Math.floor(Math.random() * filtered.length)]
        : allCards[Math.floor(Math.random() * allCards.length)];

      const finalRarity = typeof chosen.rarity === 'string' ? chosen.rarity : selectedRarity;

      result.push({
        id: chosen.id,
        name: chosen.name,
        type: chosen.type,
        race: chosen.race,
        desc: chosen.desc,
        atk: chosen.atk || null,
        def: chosen.def || null,
        level: chosen.level || null,
        rarity: finalRarity,
        price: chosen.card_prices?.[0]?.cardmarket_price || '0.00',
        image_url: chosen.card_images?.[0]?.image_url || null,
        pack: packSource
      });

      // Verifies if a card already exists in the user's collection
      const existing = user.cards.find(c =>
        c.id === chosen.id.toString() &&
        c.rarity === finalRarity &&
        c.pack === packSource
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        user.cards.push({
          id: chosen.id.toString(),
          quantity: 1,
          rarity: finalRarity,
          pack: packSource
        });
      }
    }

    await user.save();
    res.status(200).json({ cards: result });
  } catch (err) {
    console.error('❌ Error opening pack:', err.message);
    res.status(500).json({ message: 'Failed to open pack.' });
  }
};



