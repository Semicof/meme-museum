const express = require("express");
const { addReaction, getReactionsForNft, getReactionsByUser } = require("../controller/reactionController");
const router = express.Router();


router.post("/", addReaction);

router.get("/nft/:nftId", getReactionsForNft);

router.get("/user/:userId", getReactionsByUser);

module.exports = router;
