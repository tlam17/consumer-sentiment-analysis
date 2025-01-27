const pool = require("../config/pool");

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

        // Insert new review and return its details
        const query = "INSERT INTO reviews (product_id, user_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *";
        const result = await pool.query(query, [product_id, user_id, rating, review_text]);
        
        // Return created review
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Log and return error if review creation fails
        console.log(error);
        res.status(500).json({ message: "Error creating review" });
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
        const query = `SELECT review_id, product_id, rating, review_text, created_at, updated_at
                       FROM reviews
                       WHERE user_id = $1
                       ORDER BY created_at DESC`;
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
        const query = `UPDATE reviews SET rating = $1, review_text = $2 WHERE review_id = $3 RETURNING *`;
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

module.exports = {
    createReview,
    getAllReviews,
    getReviewsByProduct,
    getReviewById,
    updateReview,
    deleteReview
};