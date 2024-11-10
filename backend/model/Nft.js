const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  tokenURI: { type: String, required: true },
  tokenId: { type: String,  required: true },
  price: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  listedForSale: { type: Boolean, default: false },
  tags: [{ type: String }],
  reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }]
});

module.exports = mongoose.model("Nft", nftSchema);
