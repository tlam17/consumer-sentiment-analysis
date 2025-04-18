const pool = require("../config/pool");
const csv = require("fast-csv");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pLimit = require('p-limit');
const limit = pLimit(10);   
const { analyzeSentiment } = require("../services/analyticsService");

const upload = multer({ dest: "uploads/" });

/**
 * Create a new review in the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Created review details or error message
 */
const createReview = async (req, res) => {
    try {
        // Destructure review details from request body
        const {product_id, rating, review_text} = req.body;
        const user_id = req.userId;

        // Analyze sentiment of review
        const { success, data } = await analyzeSentiment(review_text);
        if (!success) {
            return res.status(500).json({ message: "Error analyzing sentiment" });
        }
        const sentiment_score = data.sentiment_score;

        // Insert new review and return its details
        const query = "INSERT INTO reviews (product_id, user_id, rating, review_text, sentiment_score) VALUES ($1, $2, $3, $4, $5) RETURNING *";
        const result = await pool.query(query, [product_id, user_id, rating, review_text, sentiment_score]);
        
        // Return created review
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Log and return error if review creation fails
        console.log(error);
        res.status(500).json({ message: "Error creating review" });
    }
};

/**
 * Upload bulk review data through CSV
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Created review details or error message
 */
const uploadReviews = async (req, res) => {
    try {
        const user_id = req.userId;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        
        const filePath = path.join(__dirname, "../", req.file.path);
        const reviews = [];

        fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on("data", (row) => {
            const {product_id, rating, review_text} = row;
            if (product_id && rating && review_text) {
                reviews.push({product_id, rating, review_text});
            }   
        })
        .on("end", async () => { 
            try {
                if (reviews.length === 0) {
                    return res.status(400).json({ message: "CSV file is empty or incorrectly formatted" });
                }
        
                const query = `INSERT INTO reviews 
                               (product_id, user_id, rating, review_text, sentiment_score) 
                               VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        
                const results = [];
                const failed = [];
        
                await Promise.all(reviews.map((review) =>
                    limit(async () => {
                        const { success, data } = await analyzeSentiment(review.review_text);
                        if (!success) {
                            failed.push({ review, reason: "Sentiment analysis failed" });
                            return;
                        }
        
                        try {
                            const sentiment_score = data.sentiment_score;
                            const result = await pool.query(query, [
                                review.product_id,
                                user_id,
                                review.rating,
                                review.review_text,
                                sentiment_score
                            ]);
                            results.push(result.rows[0]);
                        } catch (err) {
                            failed.push({ review, reason: "Database insert failed", error: err.message });
                        }
                    })
                ));
        
                fs.unlinkSync(filePath);
        
                res.status(201).json({
                    success_count: results.length,
                    failure_count: failed.length,
                    inserted: results,
                    failed
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "Error inserting reviews" });
            }
        })
        .on("error", (error) => {
            // Log and return error if CSV parsing fails
            console.log(error);
            res.status(500).json({ message: "Error processing CSV file" });
        });
    } catch (error) {
        // Log and return error if review upload fails
        console.log(error);
        res.status(500).json({ message: "Error uploading reviews" });
    }
};

/**
 * Retrieve all reviews associated with a user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array} List of reviews
 */
const getAllReviews = async (req, res) => {
    try {
        const user_id = req.userId;

        // Fetch all reviews, ordered by most recent
        const query = `SELECT review_id, product_id, rating, review_text, created_at, updated_at, sentiment_score
                       FROM reviews
                       WHERE user_id = $1
                       ORDER BY product_id DESC`;
        const result = await pool.query(query, [user_id]);

        // Check if any reviews exist
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No reviews found" });
        }

        // Return list of reviews
        res.status(200).json(result.rows);
    } catch (error) {
        // Log and return error if fetching reviews fails
        console.log(error);
        res.status(500).json({ message: "Error getting reviews" });
    }
};

/**
 * Retrieve reviews associated with a specific product
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array} List of reviews
 */
const getReviewsByProduct = async (req, res) => {
    try {
        // Extract product ID from route parameters
        const { productId } = req.params;

        // Fetch reviews for specific product, ordered by most recent
        const query = `SELECT review_id, product_id, rating, review_text, created_at, updated_at
                       FROM reviews
                       WHERE product_id = $1
                       ORDER BY created_at DESC`;
        const result = await pool.query(query, [productId]);

        // Check if any reviews exist for the product
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No reviews found for the specified product" });
        }

        // Return list of product reviews
        res.status(200).json(result.rows);
    } catch (error) {
        // Log and return error if fetching product reviews fails
        console.log(error);
        res.status(500).json({ message: "Error getting reviews" });
    }
};

/**
 * Retrieve a single review by its ID
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Review details
 */
const getReviewById = async (req, res) => {
    try {
        // Extract review ID from route parameters
        const { reviewId } = req.params;
        
        // Fetch specific review details
        const query = `SELECT review_id, product_id, rating, review_text, created_at, updated_at
                       FROM reviews
                       WHERE review_id = $1`;
        const result = await pool.query(query, [reviewId]);

        // Check if review exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Return review details
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Log and return error if fetching review fails
        console.log(error);
        res.status(500).json({ message: "Error getting review" });
    }
};

/**
 * Update an existing review
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Updated review details
 */
const updateReview = async (req, res) => {
    try {
        // Extract review ID from route parameters
        const { reviewId } = req.params;
        
        // Destructure update details from request body
        const { rating, review_text } = req.body;
        
        // Update review and return updated details
        const query = `UPDATE reviews SET rating = $1, review_text = $2, updated_at = NOW() WHERE review_id = $3 RETURNING *`;
        const result = await pool.query(query, [rating, review_text, reviewId]);
        
        // Return updated review
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Log and return error if updating review fails
        console.log(error);
        res.status(500).json({ message: "Error updating review" });
    }
};

/**
 * Delete a review by its ID
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Deleted review details
 */
const deleteReview = async (req, res) => {
    try {
        // Extract review ID from route parameters
        const { reviewId } = req.params;
        
        // Delete review and return its details
        const query = "DELETE FROM reviews WHERE review_id = $1 RETURNING *";
        const result = await pool.query(query, [reviewId]);
        
        // Return details of deleted review
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Log and return error if deletion fails
        console.log(error);
        res.status(500).json({ message: "Error deleting review" });
    }
};

/**
 * Get average sentiment from all reviews
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Number} Average sentiment score
 */
const getAverageSentiment = async (req, res) => {
    try {
        const user_id = req.userId;
        // Fetch average sentiment from all reviews
        const query = "SELECT AVG(sentiment_score) AS avg_sentiment FROM reviews WHERE user_id = $1";
        const result = await pool.query(query, [user_id]);
        
        // Return average sentiment
        res.status(200).json({ avg_sentiment: result.rows[0].avg_sentiment ?? 0 });
    } catch (error) {
        // Log and return error if fetching average sentiment fails
        console.log(error);
        res.status(500).json({ message: "Error getting average sentiment" });
    }
};

module.exports = {
    createReview,
    upload,
    uploadReviews,
    getAllReviews,
    getReviewsByProduct,
    getReviewById,
    updateReview,
    deleteReview,
    getAverageSentiment
};