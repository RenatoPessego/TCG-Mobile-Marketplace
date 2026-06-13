const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function checkPasswordRequirements(password) {
  if (password.length < 12) return 'Password must be at least 12 characters long';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password))
    return 'Password must contain at least one special character';
  return null;
}


exports.register = async (req, res) => {   // Register a new user
  const { name, username, email, password, confirmPassword, profileImage, birthDate } = req.body;

  if (!name || !username || !email || !password || !confirmPassword || !birthDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const passwordError = checkPasswordRequirements(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  const dayCheck = today.getDate() < birth.getDate();

  const isTooYoung =
    age < 13 || (age === 13 && (m < 0 || (m === 0 && dayCheck)));

  if (isTooYoung) {
    return res.status(403).json({ message: 'User must be at least 13 years old' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      profileImage: profileImage || 'profile-placeholder.png',
      birthDate: new Date(birthDate),
      balance: 0,
      cards: [],
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.login = async (req, res) => {  // Login user
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.profile = async (req, res) => { // Get user profile
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
};
