"use client";

import { memo } from "react";
import { MousePointer2Icon } from "lucide-react";
import { getColor } from "@/lib/utils";
import { useOther } from "@liveblocks/react/suspense";


interface CursorProps {
    connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {

    const info = useOther(connectionId, (user) => user?.info);
    const cursor = useOther(connectionId, (user) => user?.presence?.cursor);

    const name = info?.name || "Teammate";

    if(!cursor) return null;

    const { x, y } = cursor;
    const color = getColor(connectionId);
    const labelWidth = Math.max(48, name.length * 7 + 12);
    
    return (
        <g
            transform={`translate(${x} ${y})`}
            className="drop-shadow-md"
            style={{ pointerEvents: "none" }}
        >
            <MousePointer2Icon
                className="h-5 w-5"
                style={{ fill: color, color }}
            />
            <g transform="translate(20 0)">
                <rect
                    x={0}
                    y={0}
                    width={labelWidth}
                    height={20}
                    rx={6}
                    fill={color}
                />
                <text
                    x={6}
                    y={14}
                    fontSize={12}
                    fontWeight={600}
                    fill="white"
                >
                    {name}
                </text>
            </g>
        </g>
    )
});

Cursor.displayName = "Cursor";