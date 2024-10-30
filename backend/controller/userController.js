const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs");

function generateToken(walletAddress) {
  return jwt.sign({ walletAddress }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function generateRandomUsername() {
  return faker.person.fullName();
}

// Check if User Exists
exports.checkUser = async (req, res) => {
  const { walletAddress } = req.body;

  try {
    const user = await User.findOne({ walletAddress });

    if (user) {
      return res.status(200).json({ exists: true, message: "User exists. Please enter your password." });
    } else {
      return res.status(200).json({ exists: false, message: "User not found. Please register." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.registerUser = async (req, res) => {
  const { walletAddress, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ walletAddress });

    if (existingUser) {
      return res.status(400).json({ message: "Wallet address already exists. Please log in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      walletAddress,
      name: name || generateRandomUsername(),
      password: hashedPassword,
    });

    await newUser.save();
    const token = generateToken(newUser.walletAddress);
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Login Existing User
exports.loginUser = async (req, res) => {
  const { walletAddress, password } = req.body;

  try {
    const user = await User.findOne({ walletAddress });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please register." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = generateToken(user.walletAddress);
    res.status(200).json({ message: "User authenticated", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.user.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const { username, avatar } = req.body;
  const walletAddress = req.user.walletAddress;

  try {
    const user = await User.findOneAndUpdate(
      { walletAddress },
      { username, avatar },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
