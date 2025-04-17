"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart } from "lucide-react";

// Dummy distribution
const sentimentDistribution = {
  positive: 58,
  neutral: 27,
  negative: 15,
};

export function SentimentDistributionCard() {
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
            <span className="text-foreground font-medium">Positive:</span> {sentimentDistribution.positive}%
          </li>
          <li>
            <span className="text-foreground font-medium">Neutral:</span> {sentimentDistribution.neutral}%
          </li>
          <li>
            <span className="text-foreground font-medium">Negative:</span> {sentimentDistribution.negative}%
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
