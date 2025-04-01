const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const usersController = require("../controllers/usersController");

// Register a new user
router.post("/signup", usersController.registerUser);
// Login a user and generate JWT token
router.post("/login", usersController.loginUser);
// Update user information
router.put("/:userId", authMiddleware.authenticateToken, usersController.updateUser);
// Delete a user
router.delete("/:userId", authMiddleware.authenticateToken, usersController.deleteUser);
// Find user by email
router.get("/emails/:email", usersController.findUserByEmail);
// Find user by username
router.get("/usernames/:username", usersController.findUserByUsername);
// Update user password
router.put("/password/:userId", usersController.updateUserPassword);

module.exports = router;