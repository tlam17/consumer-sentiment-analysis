"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import api from "@/utils/api";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Lock, Eye, EyeOff } from "lucide-react";

export default function NewPasswordForm() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            toast.error("Passwords do not match.");
            return;
        }

        const userId = localStorage.getItem("resetUserId");

        try {
            await api.put(`/users/password/${userId}`, { password });
            localStorage.removeItem("resetUserId");
            router.push("/login");
            toast.success("Password updated successfully!");
        } catch (error) {
            toast.error("Failed to update password.");
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-2 items-center">
                    <div className="p-4 rounded-full bg-primary/50 text-primary">
                        <Lock className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">New Password</CardTitle>
                    <CardDescription>
                        Enter your new password.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        {/* Password field */}
                        <div className="grid gap-2 relative">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Confirm Password field */}
                        <div className="grid gap-2 relative">
                            <Label htmlFor="passwordConfirm">Confirm Password</Label>
                            <Input
                                id="passwordConfirm"
                                type={showPasswordConfirm ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirm(prev => !prev)}
                                className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                                tabIndex={-1}
                            >
                                {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <Button type="submit" className="w-full">
                            Reset Password
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
