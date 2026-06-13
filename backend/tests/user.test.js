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
    username: 'checkintester',
    password: 'securepass',
    balance: 0,
    pushToken: null,
    checkInHistory: []
  });
  await user.save();
  userId = user._id;
  token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });

  server = app.listen(4005);
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.dropDatabase();
  }
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('User Functionality: Push Token & Check-in', () => {
  it('should save the push token', async () => {
    const res = await request(server)
      .put('/user/pushtoken')
      .set('Authorization', `Bearer ${token}`)
      .send({ token: 'expo_push_token_123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Push token saved/i);

    const updated = await User.findById(userId);
    expect(updated.pushToken).toBe('expo_push_token_123456');
  });

  it('should reject check-in with invalid location', async () => {
    const res = await request(server)
      .post('/user/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ location: 'Atlantis' }); // localização inválida

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid location/i);
  });

  it('should allow valid check-in and reward coins', async () => {
    const res = await request(server)
      .post('/user/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ location: 'Lisbon' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/You received \+15 coins/i);

    const user = await User.findById(userId);
    expect(user.balance).toBe(15);
    expect(user.checkInHistory.length).toBe(1);
  });

  it('should not allow duplicate check-in at the same location and day', async () => {
    const res = await request(server)
      .post('/user/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send({ location: 'Lisbon' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already checked in/i);
  });
});
