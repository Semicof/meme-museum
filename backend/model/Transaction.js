const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  nft: { type: mongoose.Schema.Types.ObjectId, ref: "Nft", required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transactionDate: { type: Date, default: Date.now },
  transactionPrice: { type: Number, required: true },
  transactionType: { type: String, enum: ["buy", "sell", "transfer"], required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
