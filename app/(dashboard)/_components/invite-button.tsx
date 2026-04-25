import { Plus } from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const InviteButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite members
                </Button>
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="p-0 bg-transparent border-none max-w-[880px] flex justify-center"
            >
                <DialogTitle className="sr-only">Invite Members</DialogTitle>
                <DialogDescription className="sr-only">
                    Manage organization members and settings.
                </DialogDescription>
                <OrganizationProfile routing="hash" />
            </DialogContent>
        </Dialog>
    );
};