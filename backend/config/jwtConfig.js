const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
    return token;
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        return null;
    }
};

module.exports = { 
    generateToken,
    verifyToken
};