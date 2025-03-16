"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Review } from "@/types/reviews";
import { formatDate } from "@/utils/formatters";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Rating
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "review_text",
        header: "Review Text"
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => formatDate(row.original.created_at)
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Updated At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => formatDate(row.original.updated_at)
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const review = row.original;
            
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
                        <DropdownMenuItem onClick={() => { 
                            navigator.clipboard.writeText(review.review_id)
                            toast.success("Copied to clipboard!");
                        }}>
                            Copy Review ID
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