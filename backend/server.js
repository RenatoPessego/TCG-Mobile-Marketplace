require('dotenv').config();
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const cardRoutes = require('./routes/cards'); // ok
require('./config/passport')(passport);
const packRoutes = require('./routes/packs');
const marketRoutes = require('./routes/market');
const messageRoutes = require('./routes/message');
const userRoutes = require('./routes/user');


const path = require('path');



const app = express();
const PORT = 5000;

if (process.env.NODE_ENV !== 'test') {
  // MongoDB Atlas
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.error('MongoDB error:', err));
}
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);
app.use('/cards', cardRoutes);
app.use('/packs', packRoutes);
app.use('/market', marketRoutes);
app.use('/messages', messageRoutes);
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/user', userRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app; // Export the app for testing