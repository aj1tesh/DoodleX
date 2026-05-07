import getStroke from "perfect-freehand";
import { getSvgPathFromStroke } from "@/lib/utils";

interface PathProps {
    x: number;
    y: number;
    points: number[][];
    fill: string;
    onPointerDown?: (e: React.PointerEvent) => void;
}

export const Path = ({ x, y, points, fill, onPointerDown }: PathProps) => {
    return (
        <path
            className="drop-shadow-md"
            onPointerDown={onPointerDown ?? undefined}
            d={getSvgPathFromStroke(getStroke(points, {
                size: 11,
                thinning: 0.5,
                smoothing: 0.5,
                streamline: 0.5,
                start: { cap: false, taper: 0 },
                end: { cap: false, taper: 0 },
            })
        )}
        style={{ transform: `translate(${x}px, ${y}px)`,
        x: 0,
        y: 0,
        fill: fill,
        stroke: "none",
        }}
        />
    )
}