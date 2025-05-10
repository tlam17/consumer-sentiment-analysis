"use client";

import { useReviews } from "@/lib/ReviewContext";
import { formatDate } from "@/utils/formatters";
import { Spinner } from "@/components/ui/spinner";

export default function RecentReviews() {
  const { reviews, loading, error } = useReviews();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-6">{error}</div>;
  }

  const recent = [...reviews]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
      <ul className="space-y-4">
        {recent.map((review) => (
          <li key={review.review_id} className="p-4 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-1">
              <span>Product ID: {review.product_id}</span>
              <span>{formatDate(review.created_at)}</span>
            </div>
            <div className="text-base font-medium text-gray-800 mb-1">Rating: {review.rating}</div>
            <p className="text-sm text-gray-600 line-clamp-3">{review.review_text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
