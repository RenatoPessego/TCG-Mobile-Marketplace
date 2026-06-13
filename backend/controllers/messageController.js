const Message = require('../models/Message');
const mongoose = require('mongoose');
const User = require('../models/User');
const sendPushNotification = require('../utils/sendPushNotification');

// Sending a message
exports.sendMessage = async (req, res) => {
  try {
    const { listingId, receiverId, text } = req.body;
    const senderId = req.user.id;

    if (!listingId || !receiverId || !text) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const message = new Message({
      listingId,
      senderId,
      receiverId,
      text
    });

    await message.save();
    const receiver = await User.findById(receiverId);
    if (receiver?.pushToken) {
      await sendPushNotification(
        receiver.pushToken,
        '📩 New message received',
        text.length > 40 ? text.slice(0, 40) + '...' : text
      );
    }
    res.status(201).json({ message: 'Message sent', data: message });
  } catch (err) {
    console.error('❌ Error sending message:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const otherUserId = req.params.userId;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      listingId,
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    console.error('❌ Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to get messages' });
  }
};

// Get all the users who chatted for a listing
exports.getParticipants = async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const userId = req.user.id;

    const participants = await Message.aggregate([
      { $match: { listingId: new mongoose.Types.ObjectId(listingId) } },
      {
        $project: {
          contact: {
            $cond: [
              { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
              "$receiverId",
              "$senderId"
            ]
          }
        }
      },
      { $group: { _id: "$contact" } },
      { $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      { $project: { _id: 1, username: "$user.username", email: "$user.email" } }
    ]);

    res.status(200).json({ participants });
  } catch (err) {
    console.error("❌ Error fetching participants:", err);
    res.status(500).json({ message: "Failed to load participants" });
  }
};
