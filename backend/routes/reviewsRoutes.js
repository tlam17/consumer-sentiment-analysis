const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviewsController");

// Create a new review
router.post("/", reviewsController.createReview);
// Get all reviews
router.get("/", reviewsController.getAllReviews);
// Get reviews by product
router.get("/product/:productId", reviewsController.getReviewsByProduct);
// Get a single review by ID
router.get("/:reviewId", reviewsController.getReviewById);
// Update a review
router.put("/:reviewId", reviewsController.updateReview);
// Delete a review
router.delete("/:reviewId", reviewsController.deleteReview);

module.exports = router;