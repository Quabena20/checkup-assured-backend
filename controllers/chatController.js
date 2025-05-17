const ChatMessage = require('../models/ChatMessage');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, isAdmin } = req.body;
    const senderId = req.user._id;
    const newMessage = await ChatMessage.create({ senderId, receiverId, message, isAdmin });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { withUserId } = req.params;
    const userId = req.user._id;

    const messages = await ChatMessage.find({
      $or: [
        { senderId: userId, receiverId: withUserId },
        { senderId: withUserId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};
