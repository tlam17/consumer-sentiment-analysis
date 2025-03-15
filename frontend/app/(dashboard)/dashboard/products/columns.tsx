"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/products";
import { formatDate } from "@/utils/formatters";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;
            
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.product_id)}>
                            Copy Product ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]