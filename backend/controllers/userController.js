const User = require('../models/User');
const CHECKIN_REWARDS = {
  'Lisbon': 15,
  'Maribor': 20,
  'Ljubjana': 20,
  'Munich': 15,
  'Paris': 15,
  'Madrid': 15,
  'Cairo': 50,
  'Tokyo': 50
};

exports.pushToken = async (req, res) => {  // creates a new push token
  try {
    const user = await User.findByIdAndUpdate(req.user.id, {
      pushToken: req.body.token
    });
    res.status(200).json({ message: 'Push token saved' });
  } catch (err) {
    console.error('❌ Failed to save push token:', err);
    res.status(500).json({ message: 'Failed to save push token' });
  }
}

exports.checkin = async (req, res) => { // Check-in user to a location and reward them
  const { location } = req.body;
  if (!location || !CHECKIN_REWARDS[location]) {
    return res.status(400).json({ message: 'Invalid location.' });
  }

  try {
    const user = await User.findById(req.user.id);
    const today = new Date().toISOString().slice(0, 10); // format YYYY-MM-DD

    const alreadyCheckedIn = user.checkInHistory.some(
      (entry) =>
        entry.location === location &&
        new Date(entry.date).toISOString().slice(0, 10) === today
    );

    if (alreadyCheckedIn) {
      return res.status(400).json({ message: `You already checked in at ${location} today.` });
    }

    // Give the reward
    const reward = CHECKIN_REWARDS[location];
    user.balance += reward;

    // Save the check-in history
    user.checkInHistory.push({
      location,
      date: new Date()
    });

    await user.save();

    res.status(200).json({
      message: `🎉 You received +${reward} coins for checking in at ${location}!`
    });
  } catch (err) {
    console.error('❌ Error in check-in:', err);
    res.status(500).json({ message: 'Server error during check-in.' });
  }
}  