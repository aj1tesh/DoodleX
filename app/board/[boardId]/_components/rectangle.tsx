import { RectangleLayer } from "@/types/canvas";
import { colourToCSS } from "@/lib/utils";

interface RectangleProps {
    id: string;
    layer: RectangleLayer;
    onPointerDown: (e: React.PointerEvent, layerId: string) => void;
    selectionColor?: string | null;
}

export const Rectangle = ({ id, layer, onPointerDown, selectionColor }: RectangleProps) => {
    const { x, y, width, height, fill } = layer;
    
    return (
        <rect
            className="drop-shadow-md"
            style={{
                transform: `translate(${x}px, ${y}px)`,
            }}
            x={0}
            y={0}
            width={width}
            height={height}
            strokeWidth={1}
            fill={fill ? colourToCSS(fill) : "#000"}
            stroke={selectionColor ?? "transparent"}
            onPointerDown={(e) => onPointerDown(e, id)}
        />
    );
} 