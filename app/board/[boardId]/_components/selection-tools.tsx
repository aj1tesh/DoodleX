"use client";

import { memo } from "react";
import { Colour, Camera } from "@/types/canvas";
import { useMutation } from "@liveblocks/react/suspense";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { ColorPicker } from "./color-picker";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

interface SelectionToolsProps {
    camera: Camera;
    setLastUsedColor: (color: Colour) => void;
}

export const SelectionTools = memo(
    ({ camera, setLastUsedColor }: SelectionToolsProps) => {

    /** Paint order: index 0 = back, last index = front. */
    const sendToBack = useMutation(({ storage, self }) => {
        const liveLayerIds = storage.get("layerIds");
        const sel = new Set(self.presence.selection ?? []);
        if (sel.size === 0) return;

        const arr = Array.from(liveLayerIds);
        const selected = arr.filter((id) => sel.has(id));
        const unselected = arr.filter((id) => !sel.has(id));
        const newOrder = [...selected, ...unselected];

        liveLayerIds.clear();
        for (const id of newOrder) {
            liveLayerIds.push(id);
        }
    }, []);

    const bringToFront = useMutation(({ storage, self }) => {
        const liveLayerIds = storage.get("layerIds");
        const sel = new Set(self.presence.selection ?? []);
        if (sel.size === 0) return;

        const arr = Array.from(liveLayerIds);
        const selected = arr.filter((id) => sel.has(id));
        const unselected = arr.filter((id) => !sel.has(id));
        const newOrder = [...unselected, ...selected];

        liveLayerIds.clear();
        for (const id of newOrder) {
            liveLayerIds.push(id);
        }
    }, []);

    const setFill = useMutation(
        ({ storage, self }, fill: Colour) => {
            setLastUsedColor(fill);
            const liveLayers = storage.get("layers");

            for (const id of self.presence.selection ?? []) {
                liveLayers.get(id)?.set("fill", fill);
            }
        },
        [setLastUsedColor],
    );

    const deleteLayers = useDeleteLayers();

    const selectionBounds = useSelectionBounds();

    if(!selectionBounds) return null;

    const x = selectionBounds.width/2 + selectionBounds.x + camera.position.x;
    const y = selectionBounds.y + camera.position.y;

    return (
        <div className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none" 
        style={{ transform: `translate(
        calc(${x}px - 50%), calc(${y - 16}px - 100%))`}}>
            <ColorPicker onChange={setFill}/>

            <div className="flex flex-col gap-y-0.5">
                <Hint label="Bring to Front">
                    <Button variant="board" size="icon" onClick={() => bringToFront()}>
                        <BringToFront />
                    </Button>
                </Hint>
                <Hint label="Send to Back" side="bottom">
                    <Button variant="board" size="icon" onClick={() => sendToBack()}>
                        <SendToBack />
                    </Button>
                </Hint>
            </div>

            <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
                <Hint label="Delete">
                    <Button variant="board" size="icon" onClick={deleteLayers}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </Hint>
            </div>
        </div>
    )
});

SelectionTools.displayName = "SelectionTools";