const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarUrl: { type: String },
  walletAddress: { type: String, unique: true },
  bio: { type: String, maxlength: 500 },
  memesOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nft" }],
  memesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nft" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
