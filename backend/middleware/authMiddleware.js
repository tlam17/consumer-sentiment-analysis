const { verifyToken } = require("../../backend/config/jwtConfig");

/**
 * Middleware to authenticate requests using JWT
 * 
 * This middleware:
 * 1. Checks for the presence of an Authorization header
 * 2. Extracts and validates the JWT token
 * 3. Attaches user information to the request object if token is valid
 * 4. Allows or denies further request processing based on token validity
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} HTTP response with error status if authentication fails
 */
const authenticateToken = (req, res, next) => {
  // Extract the Authorization header
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      message: "Unauthorized: No token provided" 
    });
  }

  // Extract token, removing 'Bearer ' prefix
  const token = authHeader.split(" ")[1];

  // Verify the token
  try {
    const decoded = verifyToken(token);
    
    // Attach user ID to request object
    if (!decoded) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
    req.userId = decoded.userId;
  } catch (error) {
    return res.status(401).json({ 
      message: "Unauthorized: Invalid token" 
    });
  }

  // Proceed to the next middleware or route handler
  next();
};

module.exports = { authenticateToken };