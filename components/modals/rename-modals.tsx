"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useRenameModal } from "@/store/use-rename-modal";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Id } from "@/convex/_generated/dataModel";

export const RenameModal = () => {
    const { mutate, pending } = useApiMutation(api.board.update);
    
    const { isOpen, onClose, initialValues } = useRenameModal();
    const [title, setTitle] = useState<string>(initialValues.title);
    
    const { title: initialTitle } = initialValues;

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ id: initialValues.id as Id<"boards">, title })
        .then(() => {
            toast.success("Board renamed");
            onClose();
        })
        .catch(() => {
            toast.error("Failed to rename board");
        })
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Board</DialogTitle>
                    <DialogDescription>
                        Rename your board to a new title.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Input disabled={pending} required type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} placeholder="Board title" />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={pending} type="submit">Rename</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}