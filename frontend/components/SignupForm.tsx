"use client";

import api from "@/utils/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

export function SignupForm() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !username || !password) {
            toast.error("Please fill out all fields.");
            return;
        }

        try {
            setShowDialog(true);
        } catch (error: any) {
            toast.error("Something went wrong. Please try again.");
        }
    }

    return (
        <>
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

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                <DialogTitle className="text-xl">Email Verification</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                    We've sent a 6-digit verification code to your email. Enter it below to verify your account.
                </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                <div className="mx-auto">
                    <InputOTP maxLength={6}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                    </InputOTP>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Didn't get the code?</span>
                    <button type="button" className="text-primary underline hover:opacity-80 transition">
                    Resend
                    </button>
                </div>
                </div>

                <DialogFooter>
                <Button className="w-full">Verify & Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}
