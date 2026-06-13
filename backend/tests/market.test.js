jest.setTimeout(20000);

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');
const MarketListing = require('../models/MarketListing');

const JWT_SECRET = 'digimonSecretKey123';

let mongoServer;
let server;
let sellerToken;
let buyerToken;
let sellerId;
let buyerId;
let listingId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Criar seller com carta
  const seller = new User({
    username: 'seller',
    password: 'sellerpass',
    cards: [{
      id: '123456',
      rarity: 'Rare',
      pack: 'Phantom Nightmare',
      quantity: 1
    }],
    balance: 0
  });
  await seller.save();
  sellerId = seller._id;
  sellerToken = jwt.sign({ id: sellerId }, JWT_SECRET, { expiresIn: '1h' });

  // Criar buyer com moedas
  const buyer = new User({
    username: 'buyer',
    password: 'buyerpass',
    cards: [],
    balance: 10
  });
  await buyer.save();
  buyerId = buyer._id;
  buyerToken = jwt.sign({ id: buyerId }, JWT_SECRET, { expiresIn: '1h' });

  server = app.listen(4004);
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.dropDatabase();
  }
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('Marketplace Flow', () => {
  it('should sell a card', async () => {
    const res = await request(server)
      .post('/market/sell')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        cardId: '123456',
        rarity: 'Rare',
        pack: 'Phantom Nightmare',
        price: 2.5
      });

    expect(res.statusCode).toBe(201);
    const updatedSeller = await User.findById(sellerId);
    expect(updatedSeller.cards.length).toBe(0);

    const listings = await MarketListing.find({ sellerId });
    expect(listings.length).toBe(1);
    listingId = listings[0]._id;
  });

  it('should update the listing price', async () => {
    const res = await request(server)
      .put(`/market/${listingId}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ price: 3.0 });

    expect(res.statusCode).toBe(200);
    expect(res.body.listing.price).toBe(3.0);
  });

  it('should return all listings except user’s own', async () => {
    const res = await request(server)
      .get('/market')
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.listings)).toBe(true);
    expect(res.body.listings.length).toBe(1);
  });

  it('should buy a card from the market', async () => {
    const res = await request(server)
      .post(`/market/buy/${listingId}`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(res.statusCode).toBe(200);
    const updatedBuyer = await User.findById(buyerId);
    expect(updatedBuyer.cards.length).toBe(1);
    expect(updatedBuyer.balance).toBeLessThan(10);
  });

  it('should delete a listing and return card to seller if not sold', async () => {
    // Repor carta e criar novo listing
    await User.findByIdAndUpdate(sellerId, {
      $push: {
        cards: {
          id: '999999',
          rarity: 'Ultra Rare',
          pack: 'Phantom Nightmare',
          quantity: 1
        }
      }
    });

    const newListingRes = await request(server)
      .post('/market/sell')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        cardId: '999999',
        rarity: 'Ultra Rare',
        pack: 'Phantom Nightmare',
        price: 4.0
      });

    expect(newListingRes.statusCode).toBe(201);

    const newListing = await MarketListing.findOne({ cardId: '999999' });

    const deleteRes = await request(server)
      .delete(`/market/${newListing._id}`)
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(deleteRes.statusCode).toBe(200);
    const seller = await User.findById(sellerId);
    const returnedCard = seller.cards.find(c => c.id === '999999');
    expect(returnedCard).toBeDefined();
    expect(returnedCard.quantity).toBe(1);
  });
});
