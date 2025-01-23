const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// Create a new user
router.post("/", usersController.createUser);
// Update user information
router.put("/:userId", usersController.updateUser);
// Delete a user
router.delete("/:userId", usersController.deleteUser);
// Get user credentials by email or username
router.get("/:identifier", usersController.getUserCredentials);

module.exports = router;