"use client";

import PublicRoute from "@/components/PublicRoute";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function ResetPassword() {
    return (
        <PublicRoute>
            <div className="flex justify-center items-center min-h-screen w-full">
                <div className="w-full max-w-sm">
                    <ResetPasswordForm />
                </div>
            </div>
        </PublicRoute>
    )
}