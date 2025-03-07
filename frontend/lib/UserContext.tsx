"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

export interface User {
    user_id: number;
    username: string;
    email: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Check for token first
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            const userData = localStorage.getItem("userData");
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (error) {
                    console.error('Failed to parse user data from localStorage', error);
                    // Clear invalid data
                    localStorage.removeItem("userData");
                    localStorage.removeItem("token");
                }
            }

            setLoading(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {!loading && children}
        </UserContext.Provider>
    );
}