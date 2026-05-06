"use client";

import { memo } from "react";
import { MousePointer2Icon } from "lucide-react";
import { getColor } from "@/lib/utils";
import { useOther } from "@liveblocks/react";


interface CursorProps {
    connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {

    const info = useOther(connectionId, (user) => user?.info);
    const cursor = useOther(connectionId, (user) => user.presence.cursor);

    const name = info?.name || "Teammate";

    if(!cursor) return null;

    const { x, y } = cursor;
    
    return (
        <foreignObject 
            style={{
                transform: `translate(${x}px, ${y}px)`,
            }}
            width={name.length * 10 + 24}
            height={50}
            className="relative drop-shadow-md"
            >
            <MousePointer2Icon className="h-5 w-5" 
            style={{ fill: getColor(connectionId), color: getColor(connectionId)
            }} />
            <div className="absolute left-5 px-1.5 py-0.5 rounded-md text-white text-xs font-semibold"
                style={{ backgroundColor: getColor(connectionId) }}>
                {name}
            </div>
        </foreignObject>
    )
});

Cursor.displayName = "Cursor";