"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { Review } from "@/types/reviews";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { toast } from "sonner";

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const res = await api.get("/reviews");
                setReviews(res.data);
                setError(null);
            } catch (error: any) {
                console.error("Error loading reviews:", error);
                setError("Failed to load reviews. Please try again later.");
                toast.error("Failed to load reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();

    }, []);

    // Show loading state
    if (loading) {
        return <div className="flex items-center justify-center h-48">Loading reviews...</div>;
    }

    // Show error state
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto py-10 px-5">
            <DataTable columns={columns} data={reviews} />
        </div>
    )
}