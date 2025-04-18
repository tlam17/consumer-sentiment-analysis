"use client";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/products";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
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

import { EditProductForm } from "@/components/EditProductForm";

import { useProducts } from "@/lib/ProductContext";

export const columns: ColumnDef<Product>[] = [
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
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <span className="text-sm text-foreground">
              {row.original.name}
            </span>
        )
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
              {row.original.category_name || "No Category"}
            </span>
        )
    },
    {
        accessorKey: "total_reviews",
        header: ({ column }) => {
            return (
                <div className="flex justify-center hover:text-foreground">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="text-xs uppercase tracking-wider">Total Reviews</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => (
            <div className="w-full text-center">
                <span className="text-sm text-muted-foreground">
                    {row.original.total_reviews}
                </span>
            </div>
        )
    },
    {
        accessorKey: "average_rating",
        header: ({ column }) => {
            return (
                <div className="flex justify-center hover:text-foreground">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <span className="text-xs uppercase tracking-wider">Average Rating</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => (
            <div className="w-full text-center">
                <span className="text-sm text-muted-foreground">
                    {row.original.average_rating ?? "N/A"}
                </span>
            </div>
        )
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;
            const { deleteProduct } = useProducts();
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
                            navigator.clipboard.writeText(product.product_id)
                            toast.success("Copied to clipboard!");
                        }}>
                            Copy Product ID
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
                                        This action cannot be undone. This will permanently delete the product from the database.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteProduct(product.product_id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Edit dialog rendered outside the dropdown */}
                <EditProductForm open={editOpen} setOpen={setEditOpen} product={product} />
                </>
            );
        }
    }
]