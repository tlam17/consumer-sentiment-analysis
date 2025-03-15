/**
 * Represents a product as returned by the API
 */
export interface Product {
    product_id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    category_name: string | null;
}