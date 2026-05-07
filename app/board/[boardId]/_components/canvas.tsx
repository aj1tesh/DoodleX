"use client";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { Id } from "@/convex/_generated/dataModel";
import { CanvasMode, CanvasState, Layer, LayerType } from "@/types/canvas";
import { useCallback, useState } from "react";
import { useHistory, useCanUndo, useCanRedo, useMutation, useStorage, useOthersMapped } from "@liveblocks/react/suspense";
import { CursorPresence } from "./cursor-presence";
import { Camera, Colour, Point } from "@/types/canvas";
import { pointertoCanvas } from "@/lib/utils";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/core";
import { LayerPreview } from "@/app/board/[boardId]/_components/layer-preview";
import { useMemo } from "react";
import { getColor } from "@/lib/utils";
import { SelectionBox } from "./selection-box";

const MAX_LAYERS = 100;
interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {

    const layerIds = useStorage((root) => root.layerIds);
    
    const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });

    const [ camera, setCamera ] = useState<Camera>({ position: { x: 0, y: 0 } });
    const [lastUsedColor, setLastUsedColor] = useState<Colour>({ r: 0, g: 0, b: 0 });

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const insertLayer = useMutation(({ storage, setMyPresence }, layerType: (LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note),
        position: Point) => {
            const liveLayers = storage.get("layers");

            if (liveLayers.size >= MAX_LAYERS) {
                return;
            }

            const liveLayerIds = storage.get("layerIds");
            const layerId = nanoid();
            const layer = new LiveObject({
                type: layerType,
                x: position.x,
                y: position.y,
                width: 100,
                height: 100,
                fill: lastUsedColor,
            })
            liveLayerIds.push(layerId);
            liveLayers.set(layerId, layer as LiveObject<Layer>);
            setMyPresence({ selection: [layerId] }, { addToHistory: true });
            setCanvasState({ mode: CanvasMode.None });
        }, [lastUsedColor]);



    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            position: {
                x: camera.position.x + e.deltaX,
                y: camera.position.y + e.deltaY,
            },
        }));
    }, []);

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault();

        const current = pointertoCanvas(e, camera);

        setMyPresence({ cursor: current });
    }, []);

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null });
    }, []);

    const onPointerUp = useMutation(({}, e) => {
        const point = pointertoCanvas(e, camera);

        if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.layerType as (LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note), point);
        } else {
            setCanvasState({ mode: CanvasMode.None });
        }
        history.resume();
    }, [camera, canvasState, insertLayer, history]);

    const selections = useOthersMapped((others) => others.presence.selection);

    const onPointerDown = useMutation(({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
        if(canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting){
            return;
        }
        history.pause();
        e.stopPropagation();

        const point = pointertoCanvas(e, camera);

        if(!self.presence.selection?.includes(layerId)){
            setMyPresence({ selection: [layerId] }, { addToHistory: true });
        }
        setCanvasState({ mode: CanvasMode.Translating, current: point });
    },[camera, setCanvasState, history, canvasState.mode]);

    const layerIdstoColor = useMemo(() => {
        const layerIdstoColor: Record<string, string> = {};
        
        for(const user of selections){
            const [connectionId, selection] = user;

            for(const layerId of selection ?? []){
                layerIdstoColor[layerId] = getColor(connectionId ?? 0);
            }
        }
        return layerIdstoColor;
    }, [selections]);

    return (
        <main
            className="h-full w-full relative bg-neutral-100 touch-none"
        >
            <Info boardId={boardId as Id<"boards">} />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                undo={() => {
                    if (canUndo) {
                        history.undo();
                    }
                }}
                redo={() => {
                    if (canRedo) {
                        history.redo();
                    }
                }}
                canUndo={canUndo}
                canRedo={canRedo}
            />
            <svg className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
            >
                <g
                style={{
                    transform: `translate(${camera.position.x}px, ${camera.position.y}px)`,
                }}
                >
                    {layerIds?.map((layerId) => (
                        <LayerPreview
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={(e) => onPointerDown(e, layerId)}
                            selectionColor={layerIdstoColor[layerId] ?? null}
                        />
                    ))}
                    <SelectionBox
                        onResizeHandlePointerDown={()=>{}}/>
                    <CursorPresence />
                </g>
            </svg>
        </main>
    );
};