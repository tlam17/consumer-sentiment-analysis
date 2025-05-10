import { TotalReviewsCard } from "@/components/TotalReviewsCard";
import { AverageSentimentCard } from "@/components/AverageSentimentCard";
import { SentimentDistributionCard } from "@/components/SentimentDistributionCard";
import RecentReviews from "@/components/RecentReviews";

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <TotalReviewsCard />
        <AverageSentimentCard />
        <SentimentDistributionCard />
      </div>
      <RecentReviews />
    </div>
  );
}
