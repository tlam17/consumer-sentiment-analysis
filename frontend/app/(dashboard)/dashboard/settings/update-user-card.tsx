"use client";

import React from "react";

import api from "@/utils/api";
import { useRouter } from "next/navigation";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { useUser } from "@/lib/UserContext";

export default function UpdateUserCard() {
    const { user, setUser } = useUser();
    const router = useRouter();

    const [username, setUsername] = React.useState(user?.username || "");
    const [email, setEmail] = React.useState(user?.email || "");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    // Update user details
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }

            await api.put(`/users/${user?.user_id}`, { username, email, password });

            // Clear token and user data
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            setUser(null);
            sessionStorage.removeItem("redirectAfterLogin");
            sessionStorage.setItem("manualLogout", "true");

            localStorage.setItem("showUpdateSuccess", "true");

            // Redirect to login page
            router.push("/login");

        } catch (error: any) {
            toast.error("Failed to update user", {description: error.message});
        }
    };

    return (
        <Card className="w-full lg:w-2/3">
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>You can update your account details here.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdate}>
                    <div className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                        <Input id="username" type="text" placeholder="johndoe" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="johndoe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    <Button type="submit">Update</Button>
                </div>
                </form>
            </CardContent>
        </Card>
    )
}
    