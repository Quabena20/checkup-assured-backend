const Message = require('../models/Message');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

// Submit contact message
exports.submitContact = async (req, res) => {
  try {
    const msg = new Message(req.body);
    await msg.save();
    res.status(200).json({ message: 'Message received successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit message' });
  }
};

// Fetch inbox for Customer Service Admin
exports.getInbox = async (req, res) => {
  try {
    const inbox = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(inbox);
  } catch (err) {
    res.status(500).json({ message: 'Inbox fetch failed' });
  }
};

// Send message to all clients or all users
exports.sendBulkMessage = async (req, res) => {
  const { target, subject, body } = req.body;
  try {
    let filter = {};
    if (target === 'clients') filter = { role: 'client' };
    if (target === 'all') filter = { role: { $nin: ['mainAdmin'] } };

    const users = await User.find(filter).select('email fullName');

    for (const user of users) {
      await sendEmail(user.email, subject, `<p>Dear ${user.fullName},</p><p>${body}</p>`);
    }

    res.status(200).json({ message: `Message sent to ${users.length} ${target}` });
  } catch (err) {
    res.status(500).json({ message: 'Bulk message failed' });
  }
};
