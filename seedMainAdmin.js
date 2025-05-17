const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedMainAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ role: 'mainAdmin' });
    if (existing) {
      console.log('Main Admin already exists');
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash('6070', 10);

    const mainAdmin = new User({
      role: 'mainAdmin',
      email: 'adjeienoch77@gmail.com',
      password: hashedPassword
    });

    await mainAdmin.save();
    console.log('Main Admin account created successfully');
    process.exit();
  } catch (err) {
    console.error('Failed to create Main Admin:', err);
    process.exit(1);
  }
};

seedMainAdmin();
