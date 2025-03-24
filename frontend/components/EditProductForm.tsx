"use client";

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

interface EditProductFormProps {
    product: Product;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function EditProductForm({ open, setOpen, product }: EditProductFormProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Product {product.product_id}</DialogTitle>
                </DialogHeader>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input/>
                        </div>
                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Input/>
                        </div>
                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <Input/>
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