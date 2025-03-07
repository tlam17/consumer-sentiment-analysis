import { SignupForm } from "@/components/SignupForm"
import PublicRoute from "@/components/PublicRoute";

export default function Signup() {
    return (
        <PublicRoute>
            <div className="flex justify-center items-center min-h-screen w-full">
                <div className="w-full max-w-sm">
                    <SignupForm />
                </div>
            </div>
        </PublicRoute>
    )
}