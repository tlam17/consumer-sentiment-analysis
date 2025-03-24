"use client";

import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";

import { Review } from "@/types/reviews";
import { useReviews } from "@/lib/ReviewContext";

interface EditReviewFormProps {
    review: Review;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function EditReviewForm({ open, setOpen, review }: EditReviewFormProps) {
    const [rating, setRating] = useState(review.rating);
    const [reviewText, setReviewText] = useState(review.review_text);

    const { updateReview } = useReviews();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateReview(review.review_id, { rating, review_text: reviewText });
        setOpen(false);
    };
        
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Review</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
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
                            <Label htmlFor="reviewText">Review Text</Label>
                            <Textarea id="reviewText" value={reviewText || ""} onChange={(e) => setReviewText(e.target.value)} className="min-h-[150px]"/>
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