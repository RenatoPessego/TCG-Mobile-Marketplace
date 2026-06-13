jest.setTimeout(20000); // aumenta o tempo para evitar falhas por timeout

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
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
  console.log('✅ Connected to in-memory MongoDB');

  server = app.listen(4001);
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.dropDatabase();
  }
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('Auth Flow', () => {
  it('should register a new user', async () => {
    const res = await request(server).post('/auth/register').send({
      name: 'Test User',
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      birthDate: '1995-05-05'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/User created/i);
  });

  it('should login the user and return a token', async () => {
    const res = await request(server).post('/auth/login').send({
      username: 'testuser',
      password: 'Password123!'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.id;
    expect(userId).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    const res = await request(server).post('/auth/login').send({
      username: 'testuser',
      password: 'WrongPassword'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/incorrect/i);
  });
});