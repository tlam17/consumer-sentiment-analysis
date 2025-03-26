"use client";

import { useRouter } from "next/navigation";
import api from "@/utils/api";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useUser } from "@/lib/UserContext";

export default function DeleteAccountCard() {
    const { user, setUser } = useUser();
    const router = useRouter();

    const handleDeleteAccount = async () => {
        try {
            await api.delete(`/users/${user?.user_id}`);

            // Clear token and user data
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            setUser(null);
            sessionStorage.removeItem("redirectAfterLogin");
            sessionStorage.setItem("manualLogout", "true");

            router.push('/login');
            toast.success("Account deleted successfully");
        } catch (error: any) {
            toast.error("Failed to delete account");
        }
    };

    return (
        <Card className="border-red-500">
            <CardHeader>
                <CardTitle className="text-red-500">Danger Zone</CardTitle>
                <CardDescription>Caution! This action is irreversible.</CardDescription>
            </CardHeader>
            <CardContent>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and all of its data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    )
};
