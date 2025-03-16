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

    // Add pagination state
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const handlePageSizeChange = (pageSize: number) => {
        setPagination(prev => ({ ...prev, limit: pageSize, page: 1})); // Reset to page 1 when changing page size
    }

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);

                const res = await api.get("/reviews", {
                    params: {
                        page: pagination.page,
                        limit: pagination.limit
                    }
                });

                // Check if pagination data is present
                if (res.data.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        total: res.data.pagination.total || 0,
                        pages: res.data.pagination.pages || 0
                    }));
                } else {
                    // Fallback if the structure is different
                    setReviews(Array.isArray(res.data) ? res.data : []);
                }

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

    }, [pagination.page, pagination.limit]); // Re-fetch reviews when pagination changes

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
            <DataTable 
                columns={columns} 
                data={reviews} 
                serverPagination={{
                    pageCount: pagination.pages,
                    pageIndex: pagination.page - 1,
                    pageSize: pagination.limit,
                    totalRows: pagination.total,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange
                }}
            />
        </div>
    )
}