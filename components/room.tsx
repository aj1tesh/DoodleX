"use client";

import { ReactNode } from "react";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";

interface RoomProps {
    children: ReactNode;
    roomId: string;
    fallback: ReactNode;
}

export const Room = ({ children, roomId, fallback }: RoomProps) => {
    if (!roomId) {
        throw new Error("Room requires a non-empty roomId");
    }

    return (
        <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
            <RoomProvider id={String(roomId)} initialPresence={{}}>
                <ClientSideSuspense fallback={fallback}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
};