"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export function TotalReviewsCard() {
  const totalReviews = 8245; // Dummy data

  return (
    <Card className="shadow-sm border border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Reviews
        </CardTitle>
        <MessageCircle className="w-5 h-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{totalReviews.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground mt-1">All-time total</p>
      </CardContent>
    </Card>
  );
}
