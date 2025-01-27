const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// Retrieve JWT secret from environment variables for secure token generation
const JWT_SECRET = process.env.JWT_SECRET;

// Default token expiration time (1 hour)
const JWT_EXPIRATION = '1h';

/**
 * Generates a JSON Web Token (JWT) for user authentication
 * 
 * @param {number} userId - Unique identifier of the user
 * @param {string} [expiresIn=JWT_EXPIRATION] - Token expiration time
 * @returns {string} Signed JWT token
 */
const generateToken = (userId, expiresIn = JWT_EXPIRATION) => {
  // Create a token with user ID payload and sign it with the secret key
  return jwt.sign(
    { userId }, 
    JWT_SECRET, 
    { expiresIn }
  );
};

/**
 * Verifies the validity of a JSON Web Token
 * 
 * @param {string} token - JWT to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    // Attempt to verify and decode the token using the secret key
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Return null if token is invalid or has expired
    console.error('Token verification failed:', error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET
};