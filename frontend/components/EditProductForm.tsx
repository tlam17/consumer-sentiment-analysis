"use client";

import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Product } from "@/types/products";

import { useProducts } from "@/lib/ProductContext";

interface EditProductFormProps {
    product: Product;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function EditProductForm({ open, setOpen, product }: EditProductFormProps) {
    const [name, setName] = useState(product.name);
    const [category, setCategory] = useState(product.category_name);
    const [description, setDescription] = useState(product.description);

    const { updateProduct } = useProducts();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProduct(product.product_id, { name, category: category || "", description: description || "" });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Product {product.product_id}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" type="text" value={category || ""} onChange={(e) => setCategory(e.target.value)}/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" type="text" value={description || ""} onChange={(e) => setDescription(e.target.value)}/>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}