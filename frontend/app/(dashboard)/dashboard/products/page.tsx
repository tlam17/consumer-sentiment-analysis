"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { Product } from "@/types/products";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { toast } from "sonner";

interface ProductResponse {
    product_id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    category_name: string | null;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await api.get("/products");
                setProducts(res.data);
                setError(null);
            } catch (error: any) {
                console.error("Error loading products:", error);
                setError("Failed to load products. Please try again later.");
                toast.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

    }, []);

    // Show loading state
    if (loading) {
        return <div className="flex items-center justify-center h-48">Loading products...</div>;
    }

    // Show error state
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Products</h1>
            <DataTable columns={columns} data={products} />
        </div>
    )
}