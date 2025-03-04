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

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("userData");
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (error) {
                    console.error('Failed to parse user data from localStorage', error);
                }
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
          {children}
        </UserContext.Provider>
    );
}