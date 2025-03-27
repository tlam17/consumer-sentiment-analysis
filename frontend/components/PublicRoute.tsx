"use client";

import { useUser} from "@/lib/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicRoute({ children }: { children: React.ReactNode}) {
    const { user, loading, authError } = useUser();
    const router = useRouter();

    useEffect(() => {
        // If user is already authenticated, redirect to dashboard
        if (!loading && user && !authError) {
            router.push("/dashboard");
        }
    }, [user, loading, authError, router]);

    // If not authenticated, render the public content
  if (user) {
    return <div className="flex justify-center items-center min-h-screen">Redirecting...</div>;
  }

    return <>{children}</>;
}