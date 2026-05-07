import { Kalam } from "next/font/google";
import { TextLayer } from "@/types/canvas";
import { useMutation } from "@liveblocks/react/suspense";
import { cn, colourToCSS, getContrastingTextColor } from "@/lib/utils";

import { NoteLayer } from "@/types/canvas";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

const font = Kalam({
    weight: ["400"],
    subsets: ["latin"],
});

const calculateFontSize = (width: number, height: number) => {
    const maxFontSize = 96;
    const scaleFactor = 0.15;

    const fontSizeBasedOnHeight = height * scaleFactor;
    const fontSizeBasedOnWidth = width * scaleFactor;

    return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
}

interface NoteProps {
    id: string;
    layer: NoteLayer;
    onPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor: string | null;
}

export const Note = ({ id, layer, onPointerDown, selectionColor }: NoteProps) => {
    const { x, y, width, height, fill, value } = layer;

    const updateValue = useMutation(( { storage }, newValue: string) => {
        const liveLayers = storage.get("layers");

        liveLayers.get(id)?.set("value", newValue);
    }, []);

    const handleContentChange = (e: ContentEditableEvent) => {
        updateValue(e.target.value ?? "");
    }

    return (
        <foreignObject x={x} y={y} width={width} height={height} onPointerDown={(e) => onPointerDown(e, id)}
        style={{outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: fill ? colourToCSS(fill) : "#FDFFC4",}}
        className="shadow-md drop-shadow-xl">
            <ContentEditable
                html={value ?? ""}
                onChange={handleContentChange}
                className={cn(
                    "w-full h-full flex items-center justify-center text-center outline-none",
                    font.className,
                )}
                style={{color: getContrastingTextColor(fill), fontSize: calculateFontSize(width, height)}}
            />
        </foreignObject>
    )
}
