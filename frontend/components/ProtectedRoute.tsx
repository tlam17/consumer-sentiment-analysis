"use client";

import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check if the user is not authenticated
        if (!user && typeof window !== "undefined") {
            // Check if it's a manual logout
            const isManualLogout = sessionStorage.getItem("manualLogout") === "true";

            if (!isManualLogout) {
                toast.error("Please log in to access this page");
            } else {
                sessionStorage.removeItem("manualLogout");
            }

            // Store the attempted URL to redirect back after login
            sessionStorage.setItem("redirectAfterLogin", pathname);
            // Redirect to login page
            router.push("/login");
        }
    }, [user, pathname, router]);

    return (
        <>
        {children}
        </>
    );
}