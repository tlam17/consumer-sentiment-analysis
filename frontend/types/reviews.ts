/**
 * Represents a review as returned by the API
 */
export interface Review {
    review_id: string;
    product_id: string;
    rating: number;
    review_text: string;
    created_at: string;
    updated_at: string;
}