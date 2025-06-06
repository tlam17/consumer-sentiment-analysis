"use client";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Review } from "@/types/reviews";
import { formatDate } from "@/utils/formatters";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useReviews } from "@/lib/ReviewContext";

import { EditReviewForm } from "@/components/EditReviewForm";

export const columns: ColumnDef<Review>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
    },
    {
        accessorKey: "product_id",
        header: "Product ID",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
              {row.original.product_id}
            </span>
        )
    },
    {
        accessorKey: "rating",
        header: ({ column }) => {
            return (
                <div className="flex justify-center hover:text-foreground">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="text-xs uppercase tracking-wider">Rating</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => (
            <div className="w-full text-center">
                <span className="text-sm text-muted-foreground">
                    {row.original.rating}
                </span>
            </div>
        )
    },
    {
        accessorKey: "review_text",
        header: "Review Text",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground line-clamp-2">
              {row.original.review_text}
            </span>
        )
    },
    {
        accessorKey: "sentiment_score",
        header: ({ column }) => {
            return (
                <div className="flex justify-center hover:text-foreground">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="text-xs uppercase tracking-wider">Sentiment Score</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => (
            <div className="w-full text-center">
                <span className="text-sm text-muted-foreground">
                    {row.original.sentiment_score}
                </span>
            </div>
        )
    },
    {
        accessorKey: "polarity",
        header: "Polarity",
        cell: ({ row }) => {
            const score = row.original.sentiment_score;

            const getLabel = (score: number | null) => {
                if (score === null) return "N/A";
                if (score > 0.1) return "Positive";
                if (score < -0.1) return "Negative";
                return "Neutral";
            };

            return (
                <div className="w-full text-center">
                    <span className="text-sm text-muted-foreground">
                        {getLabel(row.original.sentiment_score)}
                    </span>
                </div>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const review = row.original;
            const { deleteReview } = useReviews();
            const [editOpen, setEditOpen] = useState(false);
            
            return (
                <>
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
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setEditOpen(true); }}>
                            Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the review from the database.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteReview(review.review_id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Edit dialog rendered outside the dropdown */}
                <EditReviewForm open={editOpen} setOpen={setEditOpen} review={review} />
                </>
            )
        }
    }
]