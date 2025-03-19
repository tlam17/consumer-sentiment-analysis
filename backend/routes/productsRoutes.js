const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new product
router.post("/", authMiddleware.authenticateToken, productsController.createProduct);
// Upload bulk products
router.post("/upload", authMiddleware.authenticateToken, productsController.upload.single("file"), productsController.uploadProducts);
// Get all products
router.get("/", authMiddleware.authenticateToken, productsController.getAllProducts);
// Get a single product by ID
router.get("/:productId", authMiddleware.authenticateToken, productsController.getProductById);
// Update a product
router.put("/:productId", authMiddleware.authenticateToken, productsController.updateProduct);
// Delete a product
router.delete("/:productId", authMiddleware.authenticateToken, productsController.deleteProduct);

module.exports = router;