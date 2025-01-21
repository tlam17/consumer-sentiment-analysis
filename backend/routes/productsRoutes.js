const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");

// Create a new product
router.post("/", productsController.createProduct);
// Get all products
router.get("/", productsController.getAllProducts);
// Get a single product by ID
router.get("/:productId", productsController.getProductById);
// Update a product
router.put("/:productId", productsController.updateProduct);
// Delete a product
router.delete("/:productId", productsController.deleteProduct);

module.exports = router;