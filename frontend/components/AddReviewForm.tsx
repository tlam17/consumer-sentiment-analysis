"use client";

import { useState } from "react";
import api from "@/utils/api";
import { useReviews } from "@/lib/ReviewContext";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function AddReviewForm() { 
    const [open, setOpen] = useState(false);
    const [product_id, setProductId] = useState("");
    const [rating, setRating] = useState(0);
    const [review_text, setReviewText] = useState("");

    const { refetchReviews } = useReviews();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post("/reviews", {
                product_id,
                rating,
                review_text
            });
            
            toast.success("Review added successfully");
            setProductId("");
            setRating(0);
            setReviewText("");
            setOpen(false);

            await refetchReviews();
        } catch (error: any) {
            toast.error("Failed to add review", {description: error.message});
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Review</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Reviews</DialogTitle>
                </DialogHeader>
                <Tabs>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="review">Single Review</TabsTrigger>
                        <TabsTrigger value="reviews">Bulk Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="review">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6 py-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="product_id">Product ID</Label>
                                <Input id="product_id" type="text" placeholder="Enter product ID associated with the review" value={product_id} onChange={(e) => setProductId(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="rating">Rating</Label>
                                <Select value={rating === 0 ? "" : rating.toString()} onValueChange={(value) => setRating(Number(value))}>
                                    <SelectTrigger>
                                        <SelectValue id="rating" placeholder="Select rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                        <SelectItem value="5">5</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="review_text">Review Text</Label>
                                <Textarea id="review_text" placeholder="Enter your review text" value={review_text} onChange={(e) => setReviewText(e.target.value)} />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save</Button>
                            </DialogFooter>
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}