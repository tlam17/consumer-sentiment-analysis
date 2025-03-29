const pool = require("../config/pool");
const argon2 = require("argon2");
const { generateToken } = require("../config/jwtConfig");

/**
 * Register a new user in the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Created user details or error message
 */
const registerUser = async (req, res) => {
    try {
        // Destructure user details from request body
        const { username, email, password } = req.body;
        
        // Hash user password for secure storage
        const hashedPassword = await argon2.hash(password);
        
        // Insert new user and return details
        const query = "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *";
        const result = await pool.query(query, [username, email, hashedPassword]);
        
        // Return created user
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Log and return error if user creation fails
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
};

/**
 * Login a user and generate JWT token
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JWT token and user details or error message
 */
const loginUser = async (req, res) => {
    try {
        // Destructure user credentials from request body
        const { identifier, password } = req.body;

        // Find user by email or username
        const query = "SELECT user_id, username, email, password_hash FROM users WHERE email = $1 OR username = $1";
        const result = await pool.query(query, [identifier]);

        if (result.rows.length === 0) { 
            return res.status(404).json({ message: "User not found" });
        }

        // Verify password
        const user = result.rows[0];
        const isPasswordValid = await argon2.verify(user.password_hash, password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = generateToken(user.user_id);
        res.status(200).json({ token, user });
    } catch (error) {
        // Log and return error if login fails
        console.log(error);
        res.status(500).json({ message: "Error logging in" });
    }
};

/**
 * Update user information
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Updated user details or error message
 */
const updateUser = async (req, res) => {
    try {
        // Extract user ID from route parameters
        const { userId } = req.params;
        
        // Destructure update details from request body
        const { username, email, password } = req.body;

        // Prepare dynamic update query
        const updates = [];
        const values = [];

        // Add username to updates if provided
        if (username) {
            updates.push(`username = $${updates.length + 1}`);
            values.push(username);
        }

        // Add email to updates if provided
        if (email) {
            updates.push(`email = $${updates.length + 1}`);
            values.push(email);
        }

        // Add hashed password to updates if provided
        if (password) {
            updates.push(`password_hash = $${updates.length + 1}`);
            const hashedPassword = await argon2.hash(password);
            values.push(hashedPassword);
        }

        // Validate that at least one field is being updated
        if (updates.length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        // Prepare and execute update query
        values.push(userId);
        const query = `UPDATE users SET ${updates.join(", ")} WHERE user_id = $${updates.length + 1} RETURNING *`;
        const result = await pool.query(query, values);
        
        // Return updated user
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Log and return error if updating user fails
        console.log(error);
        res.status(500).json({ message: "Error updating user" });
    }
};

/**
 * Delete a user by their ID
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Deleted user details or error message
 */
const deleteUser = async (req, res) => {
    try {
        // Extract user ID from route parameters
        const { userId } = req.params;
        
        // Delete user and return its details
        const deleteReviewsQuery = "DELETE FROM reviews WHERE user_id = $1";
        await pool.query(deleteReviewsQuery, [userId]);

        const deleteProductsQuery = "DELETE FROM products WHERE user_id = $1";
        await pool.query(deleteProductsQuery, [userId]);

        const query = "DELETE FROM users WHERE user_id = $1 RETURNING *";
        const result = await pool.query(query, [userId]);
        
        // Return details of deleted user
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Log and return error if deletion fails
        console.log(error);
        res.status(500).json({ message: "Error deleting user" });
    }
};

/**
 * Fetch user credentials by their email
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} User credentials or error message
 */
const findUserByEmail = async (req, res) => {
    try {
        // Extract identifier from route parameters
        const { email } = req.params;
        
        // Fetch user by email
        const query = "SELECT user_id FROM users WHERE email = $1";
        const result = await pool.query(query, [email]);
        
        // Check if user exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Return user credentials
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Log and return error if fetching user fails
        console.log(error);
        res.status(500).json({ message: "Error getting user credentials" });
    }
};

/**
 * Fetch user credentials by their username
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} User credentials or error message
 */
const findUserByUsername = async (req, res) => {
    try {
        // Extract identifier from route parameters
        const { username } = req.params;
        
        // Fetch user by username
        const query = "SELECT user_id FROM users WHERE username = $1";
        const result = await pool.query(query, [username]);
        
        // Check if user exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Return user credentials
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Log and return error if fetching user fails
        console.log(error);
        res.status(500).json({ message: "Error getting user credentials" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    findUserByEmail,
    findUserByUsername
};