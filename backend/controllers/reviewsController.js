const pool = require("../database/pool");

/**
 * Create a new review in the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Created review details or error message
 */
const createReview = async (req, res) => {
    try {
        const {product_id, rating, review_text} = req.body;
        const query = "INSERT INTO reviews (product_id, rating, review_text) VALUES ($1, $2, $3) RETURNING *";
        const result = await pool.query(query, [product_id, rating, review_text]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating review" });
    }
};

/**
 * Retrieve all reviews
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array} List of reviews
 */
const getAllReviews = async (req, res) => {
    try {
        
    } catch (error) {
        
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
        
    } catch (error) {
        
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
        
    } catch (error) {
        
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
        
    } catch (error) {
        
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
        
    } catch (error) {
        
    }
};

module.exports = {
    createReview
};