"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SmilePlus } from "lucide-react";

import api from "@/utils/api";
import { useEffect, useState } from "react";

export function AverageSentimentCard() {
    const [averageSentiment, setAverageSentiment] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    
    const fetchAverageSentiment = async () => {
        try {
            const response = await api.get("/reviews/average-sentiment");
            const score = response.data.avg_sentiment;

            // Safely parse and handle potential non-number values
            const parsed = typeof score === "number" ? score : parseFloat(score);
            setAverageSentiment(!isNaN(parsed) ? parseFloat(parsed.toFixed(2)) : 0);
        } catch (error) {
            console.error("Error fetching average sentiment:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAverageSentiment();
    }, []);
    
    const formattedSentiment =
        averageSentiment !== null
            ? `${averageSentiment > 0 ? "+" : ""}${averageSentiment}`
            : "0";

    return (
        <Card className="shadow-sm border border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg Sentiment Score
                </CardTitle>
                <SmilePlus className="w-5 h-5 text-secondary" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-foreground">
                    {loading ? (
                        <Skeleton className="w-[100px] h-[30px] rounded-full" />
                    ) : (
                        formattedSentiment
                    )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Scale: -1 to +1</p>
            </CardContent>
        </Card>
    );
}

