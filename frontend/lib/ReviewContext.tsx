"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from "@/utils/api";
import { Review } from "@/types/reviews";
import { toast } from 'sonner';

// Define the context type
interface ReviewContextType {
    reviews: Review[];
    loading: boolean;
    error: string | null;
    refetchReviews: () => Promise<void>;
    deleteReview: (reviewId: string) => Promise<void>;
}

// Create the context
const ReviewContext = createContext<ReviewContextType>({
    reviews: [],
    loading: false,
    error: null,
    refetchReviews: async () => {},
    deleteReview: async () => {}
});

export const useReviews = () => useContext(ReviewContext);

// Provider component
export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await api.get("/reviews");
            setReviews(res.data);
            setError(null);
        } catch (error: any) {
            // If it's a 404, it just means there are no reviews yet
            if (error.response && error.response.status === 404) {
                setReviews([]);
                setError(null);
            } else {
                setError("Failed to load reviews. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete review
    const deleteReview = async (reviewId: string) => {
        try {
            await api.delete(`/reviews/${reviewId}`);

            // Remove deleted review from state
            setReviews((prevReviews) => prevReviews.filter((review) => review.review_id !== reviewId));

            toast.success("Review deleted successfully!", {id: "delete-review-toast"});
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error("Failed to delete review. Please try again.");
        }
    }

    // Initial fetch
    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <ReviewContext.Provider value={{ reviews, loading, error, refetchReviews: fetchReviews, deleteReview }}>
            {children}
        </ReviewContext.Provider>
    );
};
