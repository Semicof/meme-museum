const express = require("express");
const {
  getAllUser,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controller/userController");
const router = express.Router();

// Get all users
router.get("/", getAllUser);

// Create a new user
router.post("/", createUser);

// Read user by ID
router.get("/:id", getUserById);

// Update user by ID
router.patch("/:id", updateUserById);

// Delete user by ID
router.delete("/:id", deleteUserById);

module.exports = router;
