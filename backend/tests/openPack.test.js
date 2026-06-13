jest.setTimeout(20000);

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');

const JWT_SECRET = 'digimonSecretKey123';

let mongoServer;
let server;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const user = new User({
    username: 'testuser',
    password: 'fakehash',
    cards: [],
    balance: 10
  });
  await user.save();
  userId = user._id;
  token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });

  server = app.listen(4004); // porta isolada para este teste
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.dropDatabase();
  }
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('Open Pack Flow (Backend)', () => {
  const rarity = 'common';
  const cardCount = 3;
  const packSource = 'Phantom Nightmare'; // nome válido da API

  it('should generate a pack', async () => {
    const res = await request(server)
      .post('/packs/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ rarityType: rarity, cardCount, packSource });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.packs)).toBe(true);
    expect(res.body.packs[0]).toHaveProperty('name');
    expect(res.body.packs[0]).toHaveProperty('price');
  });

  it('should open a pack and return cards', async () => {
    const res = await request(server)
      .post('/packs/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ rarity, cardCount, packSource });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.cards)).toBe(true);
    expect(res.body.cards.length).toBe(cardCount);
    expect(res.body.cards[0]).toHaveProperty('name');
    expect(res.body.cards[0]).toHaveProperty('rarity');
  });

  it('should fail to open a pack with insufficient funds', async () => {
    await User.findByIdAndUpdate(userId, { balance: 0 });

    const res = await request(server)
      .post('/packs/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ rarity: 'legendary', cardCount: 5, packSource });

    expect(res.statusCode).toBe(402);
    expect(res.body.message).toMatch(/Insufficient balance/i);
  });
});