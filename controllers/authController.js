const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Package = require('../models/Package');
const Constants = require('../models/Constants');
const { calculateMonthlyPremium } = require('../utils/premiumCalculator');

exports.registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      role,
      ghanaCard,
      faceImage,
      passportPhoto,
      packageSelected,
      frequency,
      paymentMode,
      paymentDetails,
      residence,
      guardianId,
      companyId,
      isStaff,
      registeredBy
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    let premium = 0;
    if (packageSelected && frequency) {
      const selectedPackage = await Package.findById(packageSelected);
      const constantDoc = await Constants.findOne().sort({ createdAt: -1 });
      const totalX = selectedPackage.tests.reduce((sum, t) => sum + t.cost, 0);
      premium = calculateMonthlyPremium(totalX, constantDoc.amount, frequency);
    }

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      ghanaCard,
      faceImage,
      passportPhoto,
      packageSelected,
      frequency,
      premium,
      paymentMode,
      paymentDetails,
      residence,
      guardianId,
      companyId,
      isStaff,
      registeredBy
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", req.body);

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('TOKEN GENERATED:', token);

    // Send response with token and user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
