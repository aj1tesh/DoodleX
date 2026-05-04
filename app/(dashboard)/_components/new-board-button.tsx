"use client";

import { Plus } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface NewBoardButtonProps {
    orgId: string;
    disabled: boolean;
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {

    const { mutate, pending } = useApiMutation(api.board.create);
    const router = useRouter();
    const onClick = () => {
        mutate({
            orgId,
            title: "New Board",
        })
        .then((id) => {
            toast.success("Board created");
            router.push(`/board/${id}`);
        })
        .catch(() => {
            toast.error("Failed to create board");
        })
    }

    return (
        <button
            disabled={disabled || pending}
            onClick={onClick}
            className="flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 transition text-gray-700"
        >
            <Plus className="size-8" />
            
        </button>
    )
}