"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from "@/utils/api";
import { Review } from "@/types/reviews";

// Define the context type
interface ReviewContextType {
    reviews: Review[];
    loading: boolean;
    error: string | null;
    refetchReviews: () => Promise<void>;
}

// Create the context
const ReviewContext = createContext<ReviewContextType>({
    reviews: [],
    loading: false,
    error: null,
    refetchReviews: async () => {},
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
            console.error("Error loading reviews:", error);
            setError("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <ReviewContext.Provider value={{ reviews, loading, error, refetchReviews: fetchReviews }}>
            {children}
        </ReviewContext.Provider>
    );
};
