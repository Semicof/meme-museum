const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nft: { type: mongoose.Schema.Types.ObjectId, ref: "Nft", required: true },
  reactionType: { type: String, enum: ["like", "laugh", "love"], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reaction", reactionSchema);
