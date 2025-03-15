"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/products";
import { formatDate } from "@/utils/formatters";

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "product_id",
        header: "Product ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => row.original?.category_name || "No Category"
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.original.description || "No Description"
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