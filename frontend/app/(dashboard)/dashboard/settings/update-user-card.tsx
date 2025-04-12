"use client";

import React, { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { useUser } from "@/lib/UserContext";

import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function UpdateUserCard() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showDialog, setShowDialog] = useState(false);
  const [userInputCode, setUserInputCode] = useState("");
  const [code, setCode] = useState("");

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user?.user_id}`, { username });
      toast.success("Username updated");

      // Refresh user data after updates
      await refreshUserData();
    } catch (error: any) {
      toast.error("Failed to update username", { description: error.message });
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setShowDialog(true);

    // Generate a new 6-digit code and send it to the user's new email
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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userInputCode !== code) {
      toast.error("Incorrect verification code.");
      return;
    }

    try {
      await api.put(`/users/${user?.user_id}`, { email });
      toast.success("Email updated");
      setShowDialog(false);

      // Refresh user data after updates
      await refreshUserData();
      setCode("");
      setUserInputCode("");
    } catch (error: any) {
      toast.error("Failed to update email", { description: error.message });
    }
  };

  const handleResend = async () => {
    // Generate a new 6-digit code and send it to the user's new email
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

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await api.put(`/users/password/${user?.user_id}`, { password: newPassword });

      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setUser(null);
      sessionStorage.removeItem("redirectAfterLogin");
      sessionStorage.setItem("manualLogout", "true");

      router.push("/login");
      toast.success("Password updated. Please log in again.");
    } catch (error: any) {
      toast.error("Failed to update password", { description: error.message });
    }
  };

  // Refresh user data after updates
  const refreshUserData = async () => {
    try {
      const response = await api.get(`/users/${user?.user_id}`);
      setUser(response.data);
      localStorage.setItem("userData", JSON.stringify(response.data));
    } catch (error: any) {
      console.error("Failed to fetch updated user data", error);
    }
  };

  return (
    <>
    <Card className="w-full lg:w-2/3">
      <CardHeader className="pb-2 mb-2">
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Update your account information individually.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Username Block */}
        <form onSubmit={handleUsernameUpdate} className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2">
            <User size={16} /> Username
          </Label>
          <div className="flex gap-2">
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button type="submit">Save</Button>
          </div>
        </form>

        {/* Email Block */}
        <form onSubmit={handleEmailUpdate} className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail size={16} /> Email
          </Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">Save</Button>
          </div>
        </form>

        {/* Password Block */}
        <form onSubmit={handlePasswordUpdate} className="space-y-3">
        {/* New Password */}
        <Label htmlFor="newPassword" className="flex items-center gap-2">
            <Lock size={16} /> New Password
        </Label>
        <div className="relative flex gap-2">
            <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pr-10"
            />
            <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>

        {/* Confirm Password */}
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
            <Lock size={16} /> Confirm Password
        </Label>
        <div className="relative flex gap-2">
            <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pr-10"
            />
            <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            tabIndex={-1}
            >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>

        <Button type="submit">Update Password</Button>
        </form>

      </CardContent>
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
                <Button type="submit" className="w-full">Verify & Continue</Button>
            </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    </>
  );
}
