const pool = require("../config/pool");
const csv = require("fast-csv");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: "uploads/" });

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
        const user_id = req.userId;

        // Start a database transaction to ensure data integrity
        await pool.query('BEGIN');

        // Attempt to insert new category if it doesn't exist
        const categoryQuery = "INSERT INTO categories (category_name, user_id) VALUES ($1, $2) ON CONFLICT (category_name) DO NOTHING RETURNING category_id";
        const categoryResult = await pool.query(categoryQuery, [category, user_id]);

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
            query = "INSERT INTO products (product_id, user_id, name, category_id, description) VALUES ($1, $2, $3, $4, $5) RETURNING *";
            params = [product_id, user_id, name, categoryId, description];
        } else {
            // If no product_id, let the database generate a default UUID
            query = "INSERT INTO products (user_id, name, category_id, description) VALUES ($1, $2, $3, $4) RETURNING *";
            params = [user_id, name, categoryId, description];
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
 * Upload bulk product data through CSV
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Created product details or error message
 */
const uploadProducts = async (req, res) => {
    try {
        const user_id = req.userId;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = path.join(__dirname, "../", req.file.path);
        const products = [];

        fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on("data", (row) => {
              const { product_id, name, category, description } = row;
              if (name && category) {
                products.push({ product_id, name, category, description });
              }
        })
        .on("end", async () => {
            try {
                // Check if any products were processed
                if (products.length === 0) {
                    return res.status(400).json({ message: "CSV file is empty or incorrectly formatted" });
                }

                // Process each product row concurrently
                const insertedProducts = await Promise.all(products.map(async (product) => {
                    try {
                        // Start a transaction for each product to ensure atomicity
                        await pool.query('BEGIN');

                        const categoryQuery = "INSERT INTO categories (category_name, user_id) VALUES ($1, $2) ON CONFLICT (category_name) DO NOTHING RETURNING category_id";
                        const categoryResult = await pool.query(categoryQuery, [product.category, user_id]);
                        
                        let categoryId;
                        if (categoryResult.rows.length > 0) {
                            // If a new category was inserted, use its ID
                            categoryId = categoryResult.rows[0].category_id;
                        } else {
                            // If category already exists, fetch its existing ID
                            const existingCategoryQuery = "SELECT category_id FROM categories WHERE category_name = $1";
                            const existingCategoryResult = await pool.query(existingCategoryQuery, [product.category]);
                            categoryId = existingCategoryResult.rows[0].category_id;
                        }

                        let query, params;
                        // Check if a specific product_id is provided
                        if (product.product_id) {
                            // If product_id is given, include it in the insert query
                            query = "INSERT INTO products (product_id, user_id, name, category_id, description) VALUES ($1, $2, $3, $4, $5) RETURNING *";
                            params = [product.product_id, user_id, product.name, categoryId, product.description];
                        } else {
                            // If no product_id, let the database generate a default UUID
                            query = "INSERT INTO products (user_id, name, category_id, description) VALUES ($1, $2, $3, $4) RETURNING *";
                            params = [user_id, product.name, categoryId, product.description];
                        }

                        // Execute the insert query and return the created product
                        const result = await pool.query(query, params);
                        await pool.query('COMMIT');
                        return result.rows[0];
                    } catch (error) {
                        await pool.query('ROLLBACK');
                        throw error;
                    }
                }));

                // Delete the uploaded CSV file after processing
                fs.unlinkSync(filePath);

                res.status(201).json(insertedProducts);
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "Error inserting products" });
            }
        })
        .on("error", (error) => {
            // Log and return error if CSV processing fails
            console.log(error);
            res.status(500).json({ message: "Error processing CSV file" });
        });
    } catch (error) {
        // Log and return error if product upload fails
        console.log(error);
        res.status(500).json({ message: "Error uploading products" });
    }
};

/**
 * Retrieve all products associated with the current user with their category information
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array} List of products with category details
 */
const getAllProducts = async (req, res) => {
    try {
        const user_id = req.userId;

        // Join products with categories to get category name
        const query = `
        SELECT 
            p.product_id, 
            p.name, 
            p.description, 
            p.created_at, 
            p.updated_at, 
            c.category_name,
            COUNT(r.review_id) AS total_reviews,
            ROUND(AVG(r.rating)::numeric, 2) AS average_rating
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN reviews r ON p.product_id = r.product_id
        WHERE p.user_id = $1
        GROUP BY p.product_id, p.name, p.description, p.created_at, p.updated_at, c.category_name
        ORDER BY p.name ASC`;

        // Execute query and return results
        const result = await pool.query(query, [user_id]);
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
        const user_id = req.userId;

        // Extract product ID from route parameters
        const { productId } = req.params;
        
        // Destructure update details from request body
        const {name, category, description} = req.body;

        // Start a database transaction to ensure data integrity
        await pool.query('BEGIN');
        
        // Attempt to insert new category if it doesn't exist
        const categoryQuery = "INSERT INTO categories (category_name, user_id) VALUES ($1, $2) ON CONFLICT (category_name) DO NOTHING RETURNING category_id";
        const categoryResult = await pool.query(categoryQuery, [category, user_id]);
        
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
        const updateQuery = "UPDATE products SET name = $1, category_id = $2, description = $3, updated_at = NOW() WHERE product_id = $4 RETURNING product_id, name, description, created_at, updated_at, (SELECT category_name FROM categories WHERE category_id = $2) AS category_name";
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
    upload,
    uploadProducts,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};