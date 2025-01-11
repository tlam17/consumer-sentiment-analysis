-- create_tables.sql

-- Categories Table (moved to top since it's referenced by products)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

-- Products Table
CREATE TABLE products (
    product_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) REFERENCES products(product_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 0 AND rating <= 5) NOT NULL,
    review_text TEXT NOT NULL,
    sentiment_score NUMERIC(3, 2) CHECK (sentiment_score >= -1 AND sentiment_score <= 1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    product_id VARCHAR(255) REFERENCES products(product_id) ON DELETE CASCADE,
    time_period DATE NOT NULL,
    positive_count INTEGER DEFAULT 0 NOT NULL,
    negative_count INTEGER DEFAULT 0 NOT NULL,
    neutral_count INTEGER DEFAULT 0 NOT NULL,
    average_rating NUMERIC(3,2) NOT NULL,
    total_reviews INTEGER DEFAULT 0 NOT NULL,
    average_sentiment_score NUMERIC(3,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, time_period)
);

-- Keyword Cloud Table
CREATE TABLE keywords (
    keyword_id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) REFERENCES products(product_id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    frequency INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, keyword)
);

-- Visualization Data Table
CREATE TABLE visualization_data (
    visualization_id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) REFERENCES products(product_id) ON DELETE CASCADE,
    data_type_id INTEGER REFERENCES data_types(data_type_id) ON DELETE SET NULL,
    data_blob JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data Types Table
CREATE TABLE data_types (
    data_type_id SERIAL PRIMARY KEY,
    data_type_name VARCHAR(100) UNIQUE NOT NULL
);