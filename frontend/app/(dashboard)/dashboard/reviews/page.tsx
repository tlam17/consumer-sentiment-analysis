"use client";

import { ReviewProvider } from "@/lib/ReviewContext";
import ReviewsList from "./reviews-list";

export default function Reviews() {
  return (
    <ReviewProvider>
      <ReviewsList />
    </ReviewProvider>
  );
}