import { LoginForm } from "@/components/LoginForm";
import PublicRoute from "@/components/PublicRoute";

export default function Login() {
    return (
        <PublicRoute>
            <div className="flex justify-center items-center min-h-screen w-full">
            <div className="w-full max-w-sm">
            <LoginForm />
        </div>
        </div>
        </PublicRoute>
    )
}