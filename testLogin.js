const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "adjeienoch77@gmail.com";
    const plainPassword = "6070";

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return;
    }

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (isMatch) {
      console.log("Login successful: password matches");
    } else {
      console.log("Login failed: password does NOT match");
    }
  } catch (error) {
    console.error("Error during login test:", error);
  } finally {
    mongoose.disconnect();
  }
}

testLogin();
