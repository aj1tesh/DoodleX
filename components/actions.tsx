"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConfirmModal } from "@/components/confirm-modal";
import { useRenameModal } from "@/store/use-rename-modal";

interface ActionsProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps['side'];
    sideOffset?: DropdownMenuContentProps['sideOffset'];
    id?: string;
    title?: string;
    /** When false, rename/delete are hidden (e.g. non-author non-org-admin). Copy link remains. */
    allowRenameDelete?: boolean;
}

export const Actions = ({ children, side, sideOffset, id, title, allowRenameDelete = true }: ActionsProps) => {
    const { onOpen } = useRenameModal();
    const { mutate } = useApiMutation(api.board.remove);

    const onCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/board/${id}`)
        .then(() => {
            toast.success("Board link copied to clipboard");
        })
        .catch(() => {
            toast.error("Failed to copy board link");
        })
    }

    const onDelete = () => {
        mutate({ id: id as Id<"boards"> })
        .then(() => toast.success("Board deleted"))
        .catch(() => toast.error("Failed to delete board"))
    };
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
                <DropdownMenuContent
                    side={side}
                    sideOffset={sideOffset}
                    className="w-max"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenuItem className="cursor-pointer p-3" onClick={onCopyLink}>
                        <Link2 className="size-4 mr-2" />
                        Copy Board Link
                    </DropdownMenuItem>
                    {allowRenameDelete && (
                    <DropdownMenuItem className="cursor-pointer p-3" onClick={() => onOpen(id as Id<"boards">, title as string)}>
                        <Pencil className="size-4 mr-2" />
                        Rename
                    </DropdownMenuItem>
                    )}
                    {allowRenameDelete && (
                    <ConfirmModal header="Delete Board" description="Are you sure you want to delete this board?" onConfirm={onDelete}>
                        <Button variant="ghost" className="cursor-pointer p-2 font-normal w-full justify-start text-sm">
                            <Trash2 className="size-4 mr-2" />
                            Delete
                        </Button>
                    </ConfirmModal>
                    )}
                </DropdownMenuContent>
        </DropdownMenu>
    );
};