import { toast } from "sonner";

export function handleAuthRedirect(isAuthenticated: boolean) {
    if (!isAuthenticated && typeof window !== "undefined") {
        // Check if it's a manual logout
        const isManualLogout = sessionStorage.getItem("manualLogout") === "true";

        if (!isManualLogout) {
            console.log("Not authenticated");
            toast.error("Please log in to access this page", {
                id: "login-required-toast",
            });
        } else {
            sessionStorage.removeItem("manualLogout");
        }

        return false; // Not authenticated
    }

    return true; // Authenticated
}