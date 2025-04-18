"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart } from "lucide-react";

import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useReviews } from "@/lib/ReviewContext";

export function SentimentDistributionCard() {
    const [sentimentDistribution, setSentimentDistribution] = useState({
        positive: 0,
        neutral: 0,
        negative: 0
    });
    const { reviews, loading } = useReviews();
    const totalReviews = reviews.length;

    const fetchSentimentDistribution = async () => {
        try {
            const response = await api.get("/reviews/sentiment-distribution");
            setSentimentDistribution(response.data);
        } catch (error) {
            console.error("Error fetching sentiment distribution:", error);
        }
    };

    useEffect(() => {
        fetchSentimentDistribution();
    }, []);

  return (
    <Card className="shadow-sm border border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Sentiment Distribution
        </CardTitle>
        <PieChart className="w-5 h-5 text-accent" />
      </CardHeader>
      <CardContent>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            <span className="text-foreground font-medium">Positive:</span> {loading ? <Skeleton className="w-[100px] h-[30px] rounded-full" /> : (sentimentDistribution.positive / totalReviews * 100).toFixed(2)}%
          </li>
          <li>
            <span className="text-foreground font-medium">Neutral:</span> {loading ? <Skeleton className="w-[100px] h-[30px] rounded-full" /> : (sentimentDistribution.neutral / totalReviews * 100).toFixed(2)}%
          </li>
          <li>
            <span className="text-foreground font-medium">Negative:</span> {loading ? <Skeleton className="w-[100px] h-[30px] rounded-full" /> : (sentimentDistribution.negative / totalReviews * 100).toFixed(2)}%
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
