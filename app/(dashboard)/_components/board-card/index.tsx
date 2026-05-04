"use client";

import Link from "next/link";
import Image from "next/image";
import { Overlay } from "./overlay";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/actions";
import { MoreHorizontalIcon } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
interface BoardCardProps {
    id: string;
    title: string;
    imageUrl: string;
    authorId: string;
    authorName: string;
    createdAt: number;
    orgId: string;
    isFavorite: boolean;
}

export const BoardCard = ({ id, title, imageUrl, authorId, authorName, createdAt, orgId, isFavorite }: BoardCardProps) => {
    
    const { userId } = useAuth();
    const authorLabel = userId === authorId ? "You" : authorName;
    const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });

    const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(api.board.Favorite);
    const { mutate: onUnfavorite, pending: pendingUnfavorite } = useApiMutation(api.board.Unfavorite);
    
    const toggleFavorite = () => {
        if(isFavorite){
            onUnfavorite({ id: id as Id<"boards"> })
            .catch(() => toast.error("Failed to unfavorite board"));
        } else {
            onFavorite({ id: id as Id<"boards"> })
            .catch(() => toast.error("Failed to favorite board"));
        }
    }

    return (
        <Link href={`/board/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-amber-50">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-fit"
                    />
                    <Overlay />
                    <Actions 
                        id={id}
                        title={title}
                        side="right"
                    >
                        <button className="w-full h-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground rounded-md p-2">
                            <MoreHorizontalIcon className="size-4 text-muted-foreground opacity-75 group-hover:opacity-100 transition" />
                        </button>
                    </Actions>
                </div>
                <Footer
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={toggleFavorite}
                    disabled={pendingFavorite || pendingUnfavorite}
                />
            </div>
        </Link>
    )
}

BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className="aspect-[100/127] rounded-lg justify-between overflow-hidden">
            <Skeleton className="w-full h-full" />
        </div>
    )
}