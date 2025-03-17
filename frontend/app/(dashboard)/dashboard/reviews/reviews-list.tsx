"use client";

import { useReviews } from "@/lib/ReviewContext";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function ReviewsList() {
    const { reviews, loading, error } = useReviews();

    if (loading) {
        return <div className="flex items-center justify-center h-48">Loading reviews...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto py-10 px-5">
            <DataTable columns={columns} data={reviews} />
        </div>
    );
}