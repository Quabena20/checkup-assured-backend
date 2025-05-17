const Notification = require('../models/Notification');

exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    const newNote = await Notification.create({ userId, title, message, type });
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send notification' });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve notifications' });
  }
};
