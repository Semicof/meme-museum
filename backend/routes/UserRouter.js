const express = require("express");
const { loginUser, getUserProfile, updateUserProfile, registerUser, checkUser } = require("../controller/userController");
const { authMiddleware } = require("../middlewares/authMiddlewares");

const router = express.Router();

router.post("/check",checkUser)
router.post("/register",registerUser)
router.post("/login", loginUser);

router.get("/profile", authMiddleware, getUserProfile);
router.patch("/profile", authMiddleware, updateUserProfile);

module.exports = router;
