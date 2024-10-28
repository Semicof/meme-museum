const express = require("express");
const {  getAllNFTs, getNFTById, createNFT } = require("../controller/nftController");
const { authMiddleware } = require("../middlewares/authMiddlewares");

const router = express.Router();

router.get("/", getAllNFTs);

router.get("/:id", getNFTById);

router.post("/", authMiddleware, createNFT);


module.exports = router;
