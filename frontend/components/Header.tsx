"use client";

import { useUser } from "@/lib/UserContext";

export function Header() {
  const { user } = useUser();

  return (
      <header className="w-full p-4">
        <div className="container mx-auto flex justify-end">
          <h1 className="text-2xl font-bold">Welcome Back, {user ? user.username : "User"}!</h1>
        </div>
      </header>
    )
  }