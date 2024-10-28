const express = require("express");
const router = express.Router();
const { addComment, getCommentsForNft } = require("../controller/commentController");

// Route to add a new comment to an NFT
router.post("/", addComment);

// Route to get all comments for a specific NFT
router.get("/nft/:nftId", getCommentsForNft);


module.exports = router;
