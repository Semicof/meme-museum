const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    nft: { type: mongoose.Schema.Types.ObjectId, ref: "NFT", required: true },
    type: { type: String, enum: ["ONCHAIN", "OFFCHAIN"], required: true },
    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
    hash: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
