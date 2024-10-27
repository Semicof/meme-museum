const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  nft: { type: mongoose.Schema.Types.ObjectId, ref: "Nft", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Comment", commentSchema);
