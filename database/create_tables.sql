-- create_tables.sql

-- Categories Table (moved to top since it's referenced by products)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

-- Products Table
CREATE TABLE products (
    product_id VARCHAR(255) DEFAULT gen_random_uuid()::text,
    user_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, user_id)
);

-- Reviews Table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 0 AND rating <= 5) NOT NULL,
    review_text TEXT NOT NULL,
    sentiment_score NUMERIC(3, 2) CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_product_user_fk FOREIGN KEY (product_id, user_id) REFERENCES products(product_id, user_id) ON DELETE CASCADE
);

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sentiment Analytics Table
CREATE TABLE sentiment_analytics (
    analytics_id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    time_period DATE NOT NULL,
    positive_count INTEGER DEFAULT 0 NOT NULL,
    negative_count INTEGER DEFAULT 0 NOT NULL,
    neutral_count INTEGER DEFAULT 0 NOT NULL,
    average_rating NUMERIC(3,2) NOT NULL,
    total_reviews INTEGER DEFAULT 0 NOT NULL,
    average_sentiment_score NUMERIC(3,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, user_id, time_period),
    CONSTRAINT sentiment_analytics_product_user_fk FOREIGN KEY (product_id, user_id) REFERENCES products(product_id, user_id) ON DELETE CASCADE
);

-- Keyword Cloud Table
CREATE TABLE keywords (
    keyword_id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    frequency INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, user_id, keyword),
    CONSTRAINT keywords_product_user_fk FOREIGN KEY (product_id, user_id) REFERENCES products(product_id, user_id) ON DELETE CASCADE
);

-- Visualization Data Table
CREATE TABLE visualization_data (
    visualization_id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    data_type_id INTEGER REFERENCES data_types(data_type_id) ON DELETE SET NULL,
    data_blob JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT visualization_data_product_user_fk FOREIGN KEY (product_id, user_id) REFERENCES products(product_id, user_id) ON DELETE CASCADE
);

-- Data Types Table
CREATE TABLE data_types (
    data_type_id SERIAL PRIMARY KEY,
    data_type_name VARCHAR(100) UNIQUE NOT NULL
);
