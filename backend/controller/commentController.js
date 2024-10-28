const Comment = require("../models/Comment");
const Nft = require("../models/Nft");
const User = require("../models/User");


exports.addComment = async (req, res) => {
  const { userId, nftId, content } = req.body;

  try {
    const user = await User.findById(userId);
    const nft = await Nft.findById(nftId);

    if (!user || !nft) {
      return res.status(404).json({ message: "User or NFT not found" });
    }

    const comment = new Comment({ user: userId, nft: nftId, content });
    await comment.save();

    nft.comments.push(comment._id);
    await nft.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

exports.getCommentsForNft = async (req, res) => {
    const { nftId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
  
    try {
      const totalComments = await Comment.countDocuments({ nft: nftId });
  
      const comments = await Comment.find({ nft: nftId })
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.status(200).json({
        comments,
        pagination: {
          totalComments,
          totalPages: Math.ceil(totalComments / limit),
          currentPage: page,
          pageSize: comments.length,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving comments for NFT", error });
    }
  };

