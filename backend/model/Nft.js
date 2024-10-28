const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  metadataUrl: { type: String },
  price: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  previousOwners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  listedForSale: { type: Boolean, default: false },
  tags: [{ type: String }],
  reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }]
});

module.exports = mongoose.model("Nft", nftSchema);
