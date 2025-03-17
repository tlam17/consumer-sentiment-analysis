"use client";

import { useState } from "react";
import api from "@/utils/api";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function AddProductForm() { 
    const [product_id, setProductId] = useState("");
    const [product_name, setProductName] = useState("");
    const [product_category, setProductCategory] = useState("");
    const [product_description, setProductDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post("/products", { 
               product_id, 
               name: product_name, 
               category: product_category, 
               description: product_description 
            });
            toast.success("Product added successfully");
            setProductId("");
            setProductName("");
            setProductCategory("");
            setProductDescription("");
        } catch (error: any) {
            toast.error("Failed to add product", {description: error.message});
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogDescription>
                        Add a new product to the database.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="product_id">ID</Label>
                            <Input id="product_id" type="text" placeholder="A unique ID will be generated if left empty" value={product_id} onChange={(e) => setProductId(e.target.value)}/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" type="text" placeholder="Enter product name" value={product_name} onChange={(e) => setProductName(e.target.value)}/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" type="text" placeholder="Enter product category" value={product_category} onChange={(e) => setProductCategory(e.target.value)}/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Enter product description" value={product_description} onChange={(e) => setProductDescription(e.target.value)}/>
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