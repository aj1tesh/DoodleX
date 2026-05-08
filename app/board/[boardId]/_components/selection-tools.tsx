"use client";

import { memo } from "react";
import { Camera, Layer, LayerType } from "@/types/canvas";
import { useMutation } from "@liveblocks/react/suspense";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { BringToFront, Copy, SendToBack, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/core";

interface SelectionToolsProps {
    camera: Camera;
}

export const SelectionTools = memo(
    ({ camera }: SelectionToolsProps) => {

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

    const copySelected = useMutation(({ storage, self, setMyPresence }) => {
        const selection = self.presence.selection ?? [];
        if (selection.length === 0) return;

        const liveLayers = storage.get("layers");
        const liveLayerIds = storage.get("layerIds");

        // Snapshot is the safest way to clone LiveObjects.
        const snapshot = liveLayers.toJSON() as Record<string, Layer>;
        const newIds: string[] = [];

        for (const id of selection) {
            const layer = snapshot[id];
            if (!layer) continue;

            const nextId = nanoid();
            newIds.push(nextId);

            liveLayerIds.push(nextId);
            liveLayers.set(
                nextId,
                new LiveObject({
                    ...layer,
                    x: layer.x + 12,
                    y: layer.y + 12,
                }) as LiveObject<Layer>,
            );
        }

        if (newIds.length > 0) {
            setMyPresence({ selection: newIds }, { addToHistory: true });
        }
    }, []);

    const deleteLayers = useDeleteLayers();

    const selectionBounds = useSelectionBounds();

    if(!selectionBounds) return null;

    const x = selectionBounds.width/2 + selectionBounds.x + camera.position.x;
    const y = selectionBounds.y + camera.position.y;

    return (
        <div className="absolute p-2 rounded-xl bg-white shadow-sm border flex items-center gap-1 select-none" 
        style={{ transform: `translate(
        calc(${x}px - 50%), calc(${y - 16}px - 100%))`}}>
            <Hint label="Copy">
                <Button variant="board" size="icon" onClick={() => copySelected()}>
                    <Copy className="w-4 h-4" />
                </Button>
            </Hint>
            <Hint label="Bring to Front">
                <Button variant="board" size="icon" onClick={() => bringToFront()}>
                    <BringToFront className="w-4 h-4" />
                </Button>
            </Hint>
            <Hint label="Send to Back">
                <Button variant="board" size="icon" onClick={() => sendToBack()}>
                    <SendToBack className="w-4 h-4" />
                </Button>
            </Hint>
            <Hint label="Delete">
                <Button variant="board" size="icon" onClick={deleteLayers}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </Hint>
        </div>
    )
});

SelectionTools.displayName = "SelectionTools";