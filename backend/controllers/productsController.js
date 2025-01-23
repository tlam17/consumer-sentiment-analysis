const pool = require("../database/pool");

/**
 * Create a new product in the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Created product details or error message
 */
const createProduct = async (req, res) => {
    try {
        // Destructure product details from request body
        const {product_id, name, category, description} = req.body;

        // Start a database transaction to ensure data integrity
        await pool.query('BEGIN');

        // Attempt to insert new category if it doesn't exist
        const categoryQuery = "INSERT INTO categories (category_name) VALUES ($1) ON CONFLICT (category_name) DO NOTHING RETURNING category_id";
        const categoryResult = await pool.query(categoryQuery, [category]);

        let categoryId;
        if (categoryResult.rows.length > 0) {
            // If a new category was inserted, use its ID
            categoryId = categoryResult.rows[0].category_id;
        } else {
            // If category already exists, fetch its existing ID
            const existingCategoryQuery = "SELECT category_id FROM categories WHERE category_name = $1";
            const existingCategoryResult = await pool.query(existingCategoryQuery, [category]);
            categoryId = existingCategoryResult.rows[0].category_id;
        }
        
        let query;
        let params;
        
        // Check if a specific product_id is provided
        if (product_id) {
            // If product_id is given, include it in the insert query
            query = "INSERT INTO products (product_id, name, category_id, description) VALUES ($1, $2, $3, $4) RETURNING *";
            params = [product_id, name, categoryId, description];
        } else {
            // If no product_id, let the database generate a default UUID
            query = "INSERT INTO products (name, category_id, description) VALUES ($1, $2, $3) RETURNING *";
            params = [name, categoryId, description];
        }

        // Execute the insert query and return the created product
        const result = await pool.query(query, params);

        // Commit the transaction
        await pool.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Log and return error if product creation fails
        console.log(error);
        await pool.query('ROLLBACK');
        res.status(500).json({ message: "Error creating product" });
    }
};

/**
 * Retrieve all products with their category information
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array} List of products with category details
 */
const getAllProducts = async (req, res) => {
    try {
        // Join products with categories to get category name
        const query = `SELECT p.product_id, p.name, p.description, p.created_at, p.updated_at, c.category_name
                       FROM products p
                       LEFT JOIN categories c ON p.category_id = c.category_id`;
        
        // Execute query and return results
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        // Log and return error if fetching products fails
        console.log(error);
        res.status(500).json({ message: "Error fetching products" });
    }
};

/**
 * Retrieve a single product by its ID with category information
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Product details with category information
 */
const getProductById = async (req, res) => {
    try {
        // Extract product ID from route parameters
        const { productId } = req.params;
        
        // Join products with categories to get detailed product information
        const query = `SELECT p.product_id, p.name, p.description, p.created_at, p.updated_at, c.category_name
                       FROM products p
                       LEFT JOIN categories c ON p.category_id = c.category_id
                       WHERE p.product_id = $1`;
        
        // Execute query with product ID
        const result = await pool.query(query, [productId]);
        
        // Return the first (and should be only) matching product
        res.json(result.rows[0]);
    } catch (error) {
        // Log and return error if fetching product fails
        console.log(error);
        res.status(500).json({ message: "Error fetching product" });
    }
};

/**
 * Update an existing product, with optional category creation
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Updated product details or error message
 */
const updateProduct = async (req, res) => {
    try {
        // Extract product ID from route parameters
        const { productId } = req.params;
        
        // Destructure update details from request body
        const {name, category, description} = req.body;

        // Start a database transaction to ensure data integrity
        await pool.query('BEGIN');
        
        // Attempt to insert new category if it doesn't exist
        const categoryQuery = "INSERT INTO categories (category_name) VALUES ($1) ON CONFLICT (category_name) DO NOTHING RETURNING category_id";
        const categoryResult = await pool.query(categoryQuery, [category]);
        
        let categoryId;
        if (categoryResult.rows.length > 0) {
            // If a new category was inserted, use its ID
            categoryId = categoryResult.rows[0].category_id;
        } else {
            // If category already exists, fetch its existing ID
            const existingCategoryQuery = "SELECT category_id FROM categories WHERE category_name = $1";
            const existingCategoryResult = await pool.query(existingCategoryQuery, [category]);
            categoryId = existingCategoryResult.rows[0].category_id;
        }

        // Update product with new details
        const updateQuery = "UPDATE products SET name = $1, category_id = $2, description = $3 WHERE product_id = $4 RETURNING *";
        const updateResult = await pool.query(updateQuery, [name, categoryId, description, productId]);

        // Commit the transaction
        await pool.query('COMMIT');

        // Check if product was found and updated
        if (updateResult.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Return updated product details
        res.status(200).json(updateResult.rows[0]);
    } catch (error) {
        // Rollback transaction in case of error
        console.log(error);
        await pool.query('ROLLBACK');
        res.status(500).json({ message: "Error updating product" });
    }
};

/**
 * Delete a product by its ID
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Deleted product details or error message
 */
const deleteProduct = async (req, res) => {
    try {
        // Extract product ID from route parameters
        const { productId } = req.params;
        
        // Delete product and return its details
        const query = "DELETE FROM products WHERE product_id = $1 RETURNING *";
        const result = await pool.query(query, [productId]);
        
        // Return details of deleted product
        res.json(result.rows[0]);
    } catch (error) {
        // Log and return error if deletion fails
        console.log(error);
        res.status(500).json({ message: "Error deleting product" });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};