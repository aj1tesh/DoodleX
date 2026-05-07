"use client";

import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react/suspense";
import { memo } from "react";
import { Rectangle } from "./rectangle";
import { Ellipse } from "@/app/board/[boardId]/_components/ellipse";
import { Text } from "@/app/board/[boardId]/_components/text";
import { Note } from "./note";
import { Path } from "@/app/board/[boardId]/_components/path";
import { colourToCSS } from "@/lib/utils";

interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
    selectionColor: string | null;
}

export const LayerPreview = memo(({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {

    const layer = useStorage((root) => root.layers[id]);

    if(!layer) return null;

    switch(layer.type) {
        case LayerType.Ellipse:
            return (
                <Ellipse
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            )
        case LayerType.Rectangle:
            return (
                <Rectangle
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            )
        case LayerType.Text:
            return (
                <Text
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            )
        case LayerType.Note:
            return (
                <Note
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            )
        case LayerType.Path:
            return (
                <Path
                    key={id}
                    x={layer.x}
                    y={layer.y}
                    points={layer.points}
                    fill={layer.fill ? colourToCSS(layer.fill) : "#000000"}
                    onPointerDown={(e) => onLayerPointerDown(e, id)}
                />
            )
        default:
            return null;
    }
});

LayerPreview.displayName = "LayerPreview";