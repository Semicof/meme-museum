const express = require("express");
const { createNft, getNftById, updateNft, deleteNft, transferNft } = require("../controller/nftController");
const { authMiddleware } = require("../middlewares/authMiddlewares");

const router = express.Router();

router.get("/:id", getNftById);

router.post("/", authMiddleware, createNft);
router.put("/:id", authMiddleware, updateNft);
router.delete("/:id", authMiddleware, deleteNft);
router.post("/:id/transfer", authMiddleware, transferNft);

module.exports = router;
