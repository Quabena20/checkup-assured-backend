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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Unexpected server error" });
  }
};
