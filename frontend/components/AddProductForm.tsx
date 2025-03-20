"use client";

import { useState } from "react";
import api from "@/utils/api";
import { useProducts } from "@/lib/ProductContext";

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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Dropzone,
    DropzoneDescription,
    DropzoneGroup,
    DropzoneInput,
    DropzoneTitle,
    DropzoneUploadIcon,
    DropzoneZone,
} from "@/components/ui/dropzone"
import {
    FileList,
    FileListDescription,
    FileListHeader,
    FileListIcon,
    FileListInfo,
    FileListActions,
    FileListAction,
    FileListItem,
    FileListName,
    FileListSize,
} from "@/components/ui/file-list"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash } from "lucide-react";

export function AddProductForm() { 
    const [open, setOpen] = useState(false);
    const [product_id, setProductId] = useState("");
    const [product_name, setProductName] = useState("");
    const [product_category, setProductCategory] = useState("");
    const [product_description, setProductDescription] = useState("");
    // State for the CSV file in bulk upload
    const [bulkFile, setBulkFile] = useState<File | null>(null);

    const { refetchProducts } = useProducts();

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
            setOpen(false);

            await refetchProducts();
        } catch (error: any) {
            toast.error("Failed to add product", {description: error.message});
        }
    };

    const handleBulkUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bulkFile) {
            toast.error("Please select a CSV file");
            return;
        }

        // Create form data for file upload
        const formData = new FormData();
        formData.append("file", bulkFile);

        try {
            await api.post("/products/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.success("Products uploaded successfully!");
            setBulkFile(null);
            setOpen(false);

            // Refetch products after uploading new products
            await refetchProducts();
        } catch (error: any) {
            toast.error("Failed to upload products", {description: error.message});
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                <Tabs>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="product">Single Product</TabsTrigger>
                        <TabsTrigger value="products">Bulk Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="product">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6 py-5">
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
                    </TabsContent>
                    <TabsContent value="products">
                    <form onSubmit={handleBulkUpload} className="py-5">
                            <Dropzone accept={{"text/csv": [".csv"]}} onDropAccepted={(files) => setBulkFile(files[0])} maxFiles={1}>
                                <div className="grid gap-4">
                                <DropzoneZone>
                                    <DropzoneInput />
                                    <DropzoneGroup className="gap-4">
                                        <DropzoneUploadIcon />
                                        <DropzoneGroup>
                                            <DropzoneTitle>Drop CSV file here or click to upload</DropzoneTitle>
                                            <DropzoneDescription>
                                                Each row should have product_id, name, category, and description columns.
                                            </DropzoneDescription>
                                        </DropzoneGroup>
                                    </DropzoneGroup>
                                </DropzoneZone>
                                <FileList>
                                    {bulkFile && (
                                        <FileListItem>
                                            <FileListHeader>
                                                <FileListIcon />
                                                <FileListInfo>
                                                    <FileListName>{bulkFile.name}</FileListName>
                                                    <FileListDescription>
                                                        <FileListSize>{bulkFile.size}</FileListSize>
                                                    </FileListDescription>
                                                </FileListInfo>
                                                <FileListActions>
                                                    <FileListAction onClick={() => setBulkFile(null)}>
                                                        <Trash className="size-4" />
                                                    </FileListAction>
                                                </FileListActions>
                                            </FileListHeader>
                                        </FileListItem>
                                    )}
                                </FileList>
                                </div>
                            </Dropzone>
                            <DialogFooter className="py-2">
                                <Button type="submit" onClick={handleBulkUpload}>Upload Products</Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}