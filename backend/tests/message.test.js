jest.setTimeout(20000);

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');
const Message = require('../models/Message');

const JWT_SECRET = 'digimonSecretKey123';

let mongoServer;
let server;
let senderToken, receiverToken;
let senderId, receiverId;
let listingId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Criar sender
  const sender = new User({
    username: 'senderUser',
    password: 'fakepass1',
    balance: 0
  });
  await sender.save();
  senderId = sender._id;
  senderToken = jwt.sign({ id: senderId }, JWT_SECRET, { expiresIn: '1h' });

  // Criar receiver
  const receiver = new User({
    username: 'receiverUser',
    password: 'fakepass2',
    balance: 0
  });
  await receiver.save();
  receiverId = receiver._id;
  receiverToken = jwt.sign({ id: receiverId }, JWT_SECRET, { expiresIn: '1h' });

  // Simular um anúncio com ObjectId fictício
  listingId = new mongoose.Types.ObjectId();

  server = app.listen(4006);
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.dropDatabase();
  }
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('Messaging Flow', () => {
  it('should send a message', async () => {
    const res = await request(server)
      .post('/messages')
      .set('Authorization', `Bearer ${senderToken}`)
      .send({
        listingId,
        receiverId,
        text: 'Hello! Is this still available?'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Message sent/);
    expect(res.body.data).toHaveProperty('text', 'Hello! Is this still available?');
  });

  it('should retrieve the message history between two users', async () => {
    const res = await request(server)
      .get(`/messages/${listingId}/${senderId}`)
      .set('Authorization', `Bearer ${receiverToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.messages)).toBe(true);
    expect(res.body.messages.length).toBeGreaterThan(0);
    expect(res.body.messages[0]).toHaveProperty('text', 'Hello! Is this still available?');
  });

  it('should list the participants who messaged about a listing', async () => {
    const res = await request(server)
      .get(`/messages/participants/${listingId}`)
      .set('Authorization', `Bearer ${senderToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.participants)).toBe(true);
    expect(res.body.participants.length).toBe(1);
    expect(res.body.participants[0]).toHaveProperty('username', 'receiverUser');
  });
});
