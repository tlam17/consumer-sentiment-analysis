"use client";

import api from "@/utils/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

export function SignupForm() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const signupData = await api.post("/users/signup", { email, username, password });
            router.push("/login");
            toast.success("Success!", {description: "You can now login with your new credentials!"});
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Let's create your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="johndoe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" type="text" placeholder="johndoe" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <Button type="submit" className="w-full">Sign Up</Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <p className="text-sm">Already have an account? <a className="underline" href="/login">Login</a></p>
            </CardFooter>
        </Card>
    )
}
