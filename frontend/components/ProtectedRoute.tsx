"use client";

import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import { useEffect } from "react";
import { handleAuthRedirect } from "@/utils/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const isAuthenticated = !!user;
        
        if (!handleAuthRedirect(isAuthenticated)) {
            sessionStorage.setItem("redirectAfterLogin", pathname);
            router.push("/login");
        }
    }, [user, pathname, router]);

    return (
        <>
        {children}
        </>
    );
}