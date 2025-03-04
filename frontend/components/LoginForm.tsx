"use client";

import api from "@/utils/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { useUser } from "@/lib/UserContext";

export function LoginForm() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { setUser } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await api.post("/users/login", { identifier, password });
            const { user_id, username, email } = res.data.user;
            const userData = { user_id, username, email };

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userData", JSON.stringify(userData));
            setUser(userData);

            router.push("/");
            toast.success("Login successful!");
        } catch (error: any) {
            toast.error("Invalid credentials", {description: "Please check your email/username and password"});
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your email/username and password</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="identifier">Email/Username</Label>
                            <Input id="identifier" type="text" placeholder="johndoe@example.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a className="hover:underline inline-block ml-auto text-sm" href="#">Forgot password?</a>
                            </div>
                            <Input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full">Login</Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <p className="text-sm">Don't have an account? <a className="underline" href="/signup">Sign up</a></p>
            </CardFooter>
        </Card>
    )
}