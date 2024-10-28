const Reaction = require("../models/Reaction");
const Nft = require("../models/Nft");
const User = require("../models/User");

// Add a new reaction
exports.addReaction = async (req, res) => {
  const { userId, nftId, reactionType } = req.body;

  try {
    const user = await User.findById(userId);
    const nft = await Nft.findById(nftId);

    if (!user || !nft) {
      return res.status(404).json({ message: "User or NFT not found" });
    }

    const reaction = new Reaction({ user: userId, nft: nftId, reactionType });
    await reaction.save();

    nft.reactions.push(reaction._id);
    await nft.save();

    res.status(201).json(reaction);
  } catch (error) {
    res.status(500).json({ message: "Error adding reaction", error });
  }
};

// Get all reactions for a specific NFT
exports.getReactionsForNft = async (req, res) => {
  try {
    const reactions = await Reaction.find({ nft: req.params.nftId }).populate("user", "name email");
    res.status(200).json(reactions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reactions for NFT", error });
  }
};

// Get all reactions by a specific user
exports.getReactionsByUser = async (req, res) => {
  try {
    const reactions = await Reaction.find({ user: req.params.userId }).populate("nft", "name description");
    res.status(200).json(reactions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reactions by user", error });
  }
};
