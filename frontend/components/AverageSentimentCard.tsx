"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SmilePlus } from "lucide-react";

export function AverageSentimentCard() {
  const averageSentiment = 0.72; // Dummy score

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
          {averageSentiment > 0 ? `+${averageSentiment}` : averageSentiment}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Scale: -1 to +1</p>
      </CardContent>
    </Card>
  );
}
