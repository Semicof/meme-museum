const express = require("express");
const {
  getAllNft,
  createNft,
  getNftById,
  updateNftById,
  deleteNftById,
} = require("../controller/nftController");
const router = express.Router();

// Get all NFTs
router.get("/", getAllNft);

// Create a new NFT
router.post("/", createNft);

// Read NFT by ID
router.get("/:id", getNftById);

// Update NFT by ID
router.patch("/:id", updateNftById);

// Delete NFT by ID
router.delete("/:id", deleteNftById);

module.exports = router;
