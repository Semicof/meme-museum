const express = require("express");
const { loginUser, getUserProfile, updateUserProfile, registerUser, checkUser, changePassword } = require("../controller/userController");
const { authMiddleware } = require("../middlewares/authMiddlewares");

const router = express.Router();

router.post("/check",checkUser);
router.post("/register",registerUser);
router.post("/login", loginUser);

//protected routes with authorization middleware
router.get("/profile", authMiddleware, getUserProfile);
router.patch("/profile", authMiddleware, updateUserProfile);
router.post("/changePassword", authMiddleware, changePassword);

module.exports = router;
