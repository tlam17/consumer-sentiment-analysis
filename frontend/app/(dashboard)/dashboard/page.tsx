import { TotalReviewsCard } from "@/components/TotalReviewsCard";
import { AverageSentimentCard } from "@/components/AverageSentimentCard";
import { SentimentDistributionCard } from "@/components/SentimentDistributionCard";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <TotalReviewsCard />
        <AverageSentimentCard />
        <SentimentDistributionCard />
      </div>
    </div>
  );
}
