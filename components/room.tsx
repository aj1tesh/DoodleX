"use client";

import { ReactNode } from "react";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/core";
import { Layer } from "@/types/canvas";


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
        <LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={16}>
            <RoomProvider id={String(roomId)} initialPresence={{ cursor: null, selection: [] }}
                initialStorage={{ 
                    layers: new LiveMap<string, LiveObject<Layer>>(), 
                    layerIds: new LiveList([]) 
                    }}>
                <ClientSideSuspense fallback={fallback}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
};