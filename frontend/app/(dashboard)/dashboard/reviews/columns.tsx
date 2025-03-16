"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Review } from "@/types/reviews";
import { formatDate } from "@/utils/formatters";

export const columns: ColumnDef<Review>[] = [
    {
        accessorKey: "review_id",
        header: "Review ID"
    },
    {
        accessorKey: "product_id",
        header: "Product ID"
    },
    {
        accessorKey: "rating",
        header: "Rating"
    },
    {
        accessorKey: "review_text",
        header: "Review Text"
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => formatDate(row.original.created_at)
    },
    {
        accessorKey: "updated_at",
        header: "Updated At",
        cell: ({ row }) => formatDate(row.original.updated_at)
    }
]