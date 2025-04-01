"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/utils/api";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

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

import { Lock } from "lucide-react";

export default function ResetPasswordForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [code, setCode] = useState("");
    const [userInputCode, setUserInputCode] = useState("");

    // Handle form submission for email verification
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verify that the email exists in the database
        try {
            const res = await api.get(`/users/emails/${email}`);
            
            localStorage.setItem("resetUserId", res.data.user_id);
            console.log(localStorage.getItem("resetUserId"));
            
            setShowDialog(true);
            // Generate a 6-digit code
            const newCode = Math.floor(100000 + Math.random() * 900000).toString();
            setCode(newCode);

            // Send the code to the user's email
            try {
                await api.post("/send-verification/send", {
                    email,
                    code: newCode
                });
            } catch (error: any) {
                toast.error("Something went wrong. Please try again.");
                return;
            }
        } catch (error: any) {
            toast.error("There is no account associated with this email.");
            return;
        }
    };

    // Handle verification code submission
    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();

        if (userInputCode !== code) {
            toast.error("Incorrect verification code.");
            return;
        }

        toast.success("Code verified successfully!");
        setShowDialog(false);

        router.push("/reset/new");
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
                    <div className="flex flex-col gap-2 items-center">
                        <div className="p-4 rounded-full bg-primary/50 text-primary">
                            <Lock className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>
                            Forgot your password? Enter your email and we'll send you a 6-digit code.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="identifier">Email</Label>
                                <Input
                                    id="identifier"
                                    type="text"
                                    placeholder="johndoe@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Send Code
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Email Verification</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            We’ve sent a 6-digit verification code to your email. Enter it below to reset your password.
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
                                <button
                                    onClick={handleResend}
                                    type="button"
                                    className="text-primary underline hover:opacity-80 transition"
                                >
                                    Resend
                                </button>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" className="w-full">
                                Verify & Continue
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
