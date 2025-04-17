"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"
import { MessageCircle } from "lucide-react";

import { useReviews } from "@/lib/ReviewContext";

export function TotalReviewsCard() {
  const { reviews, loading, error } = useReviews();
  const totalReviews = reviews.length;

  return (
    <Card className="shadow-sm border border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Reviews
        </CardTitle>
        <MessageCircle className="w-5 h-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
            {loading ? <Skeleton className="w-[100px] h-[30px] rounded-full" /> : totalReviews.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground mt-1">All-time total</p>
      </CardContent>
    </Card>
  );
}
