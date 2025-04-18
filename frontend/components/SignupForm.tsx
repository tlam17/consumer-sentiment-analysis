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
    DialogTitle
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

import { Eye, EyeOff } from "lucide-react";


export function SignupForm() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [code, setCode] = useState("");
    const [userInputCode, setUserInputCode] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const resEmailCheck = await api.get(`/users/emails/${email}`);
            if (resEmailCheck.status === 200) {
                toast.error("There is already an account associated with this email.");
                return;
            }
        } catch (error: any) {
            if (error.response?.status !== 404) {
                toast.error("Something went wrong. Please try again.");
                return;
            }
            // 404 means email is available — continue
        }

        try {
            const resUsernameCheck = await api.get(`/users/usernames/${username}`);
            if (resUsernameCheck.status === 200) {
                toast.error("There is already an account associated with this username.");
                return;
            }
        } catch (error: any) {
            if (error.response?.status !== 404) {
                toast.error("Something went wrong. Please try again.");
                return;
            }
            // 404 means username is available — continue
        }

        setShowDialog(true);

        // Generate a new 6-digit code and send it to the user's email
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        setCode(newCode);
        try {
            await api.post("/send-verification/send", {
                email,
                code: newCode
            });
        } catch (error: any) {
            toast.error("Something went wrong. Please try again.");
            return;
        }
    };

    // Handle verification
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userInputCode !== code) {
            toast.error("Incorrect verification code.");
            return;
        }

        try {
            await api.post("/users/signup", {
                email,
                username,
                password
            });
            toast.success("Account created successfully! Please log in with your new account.");
            setShowDialog(false);
            router.push("/login");
        } catch (error: any) {
            toast.error("Something went wrong. Please try again.");
            return;
        }
    };

    // Resend verification code
    const handleResend = async () => {
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        setCode(newCode);
        try {
            await api.post("/send-verification/send", {
                email,
                code: newCode
            });
            toast.success("Verification code sent successfully.");
        } catch (error: any) {
            toast.error("Something went wrong. Please try again.");
            return;
        }
    };

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
                            <div className="grid gap-2 relative">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
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
                <form onSubmit={handleVerify}>
                    <div className="flex flex-col gap-4 py-4">
                    <div className="mx-auto">
                        <InputOTP maxLength={6} value={userInputCode} onChange={setUserInputCode}>
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
                        <button onClick={handleResend} type="button" className="text-primary underline hover:opacity-80 transition">
                        Resend
                        </button>
                    </div>
                    </div>

                    <DialogFooter>
                    <Button type="submit" className="w-full">Verify & Continue</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        </>
    )
}
