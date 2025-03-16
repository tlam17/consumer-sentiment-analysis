import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddReviewForm() { 
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Review</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Review</DialogTitle>
                    <DialogDescription>
                        Add a new review to the database.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}