const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const usersController = require("../controllers/usersController");

// Register a new user
router.post("/", usersController.registerUser);
// Login a user and generate JWT token
router.post("/login", usersController.loginUser);
// Update user information
router.put("/:userId", authMiddleware.authenticateToken, usersController.updateUser);
// Delete a user
router.delete("/:userId", authMiddleware.authenticateToken, usersController.deleteUser);
// Get user credentials by email or username
router.get("/:identifier", usersController.getUserCredentials);

module.exports = router;