import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});


// Response interceptor to handle auth errors
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
    return Promise.reject(error);
});

api.interceptors.response.use((response) => response, (error) => {
    if (error.response) {
        // Handle 401 Unauthorized or 403 Forbidden responses
        if (error.response.status === 401 || error.response.status === 403) {
            // Clear auth data
            localStorage.removeItem("token");
            localStorage.removeItem("userData");

            // Store current location to redirect back after login
            if (typeof window !== "undefined") {
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                    sessionStorage.setItem("redirectAfterLogin", currentPath);
                }

                // Display error message
                toast.error("Your session has expired. Please log in again.");
            }

            // Redirect to login page
            window.location.href = "/login";
        }
    }
    return Promise.reject(error);
});

export default api;