const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviewsController");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new review
router.post("/", authMiddleware.authenticateToken, reviewsController.createReview);
// Upload bulk reviews
router.post("/upload", authMiddleware.authenticateToken, reviewsController.upload.single("file"), reviewsController.uploadReviews);
// Get all reviews
router.get("/", authMiddleware.authenticateToken, reviewsController.getAllReviews);
// Get reviews by product
router.get("/product/:productId", authMiddleware.authenticateToken, reviewsController.getReviewsByProduct);
// Get average sentiment
router.get("/average-sentiment", authMiddleware.authenticateToken, reviewsController.getAverageSentiment);
// Get a single review by ID
router.get("/:reviewId", authMiddleware.authenticateToken, reviewsController.getReviewById);
// Update a review
router.put("/:reviewId", authMiddleware.authenticateToken, reviewsController.updateReview);
// Delete a review
router.delete("/:reviewId", authMiddleware.authenticateToken, reviewsController.deleteReview);

module.exports = router;