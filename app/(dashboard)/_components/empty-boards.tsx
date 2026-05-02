"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const EmptyBoards = () => {
    const { organization } = useOrganization();
    const { mutate: create, pending } = useApiMutation(api.board.create);

    const onClick = () => {
        if(!organization?.id) return;

        create({
            title: "New Board",
            orgId: organization?.id,
        }).then((id) => {
            toast.success("Board created successfully");
        }).catch((error) => {
            toast.error("Failed to create board");
        });
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Image src="/empty-search.svg" alt="Empty Boards" width={140} height={140} />
            <h2 className="text-2xl font-bold">No boards found</h2>
            <p className="text-sm text-muted-foreground">Create a new board to get started</p>
            <Button onClick={onClick} className="mt-4" disabled={pending}>
                {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Board"}
            </Button>
        </div>
    )
}