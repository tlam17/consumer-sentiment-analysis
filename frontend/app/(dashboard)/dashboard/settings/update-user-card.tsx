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

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user?.user_id}`, { username });
      toast.success("Username updated");
    } catch (error: any) {
      toast.error("Failed to update username", { description: error.message });
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user?.user_id}`, { email });
      toast.success("Email updated");
    } catch (error: any) {
      toast.error("Failed to update email", { description: error.message });
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

  return (
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
  );
}
