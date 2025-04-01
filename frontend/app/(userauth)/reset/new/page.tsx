"use client";

import NewPasswordForm from "@/components/NewPasswordForm";
import PublicRoute from "@/components/PublicRoute";

export default function ResetNew() {

    return (
        <PublicRoute>
            <div className="flex justify-center items-center min-h-screen w-full">
                <div className="w-full max-w-sm">
                    <NewPasswordForm />
                </div>
            </div>
        </PublicRoute>
    )
}