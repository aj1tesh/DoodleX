"use client";

import { ReactNode } from "react";
import {
    ClientSideSuspense,
    LiveblocksProvider,
    RoomProvider,
} from "@liveblocks/react/suspense";
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