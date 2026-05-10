"use client";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { Id } from "@/convex/_generated/dataModel";
import { CanvasMode, CanvasState, Layer, LayerType } from "@/types/canvas";
import { useCallback, useState } from "react";
import { useHistory, useCanUndo, useCanRedo, useMutation, useStorage, useOthersMapped, useSelf } from "@liveblocks/react/suspense";
import { CursorPresence } from "./cursor-presence";
import { Camera, Colour, Point, Side, XYWH } from "@/types/canvas";
import { colourToCSS, findIntersectingLayersWithRectangle, penPointsToPathLayer, pointertoCanvas, resizeBounds } from "@/lib/utils";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/core";
import { LayerPreview } from "@/app/board/[boardId]/_components/layer-preview";
import { useMemo } from "react";
import { getColor } from "@/lib/utils";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { Path } from "./path";
import { useDisableBounce } from "@/hooks/use-disable-bounce";
import { Formatter } from "./formatter";

const MAX_LAYERS = 100;
interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {

    const layerIds = useStorage((root) => root.layerIds);

    const pencilDraft = useSelf((me) => me.presence.pencilDraft);
    
    const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });

    const [ camera, setCamera ] = useState<Camera>({ position: { x: 0, y: 0 } });
    const DEFAULT_COLOR: Colour = { r: 255, g: 255, b: 255 };
    const [lastUsedColors, setLastUsedColors] = useState<Record<LayerType, Colour>>({
        [LayerType.Rectangle]: DEFAULT_COLOR,
        [LayerType.Ellipse]: DEFAULT_COLOR,
        [LayerType.Path]: DEFAULT_COLOR,
        [LayerType.Text]: DEFAULT_COLOR,
        [LayerType.Note]: DEFAULT_COLOR,
    });

    const setLastUsedColorForType = useCallback((layerType: LayerType, color: Colour) => {
        setLastUsedColors((prev) => ({
            ...prev,
            [layerType]: color,
        }));
    }, []);

    useDisableBounce();

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
                fill: lastUsedColors[layerType] ?? DEFAULT_COLOR,
            })
            liveLayerIds.push(layerId);
            liveLayers.set(layerId, layer as LiveObject<Layer>);
            setMyPresence({ selection: [layerId] }, { addToHistory: true });
            setCanvasState({ mode: CanvasMode.None });
        }, [DEFAULT_COLOR, lastUsedColors]);

        const TranslateSelectedLayers = useMutation(({ storage, self }, point: Point) => {
            if (canvasState.mode !== CanvasMode.Translating) return;

            const offset = {
                x: point.x - canvasState.current.x,
                y: point.y - canvasState.current.y,
            };

            const liveLayers = storage.get("layers");

            for(const layerId of self.presence.selection ?? []){
                const layer = liveLayers.get(layerId);

                if(layer){
                    layer.update({
                        x: layer.get("x") + offset.x,
                        y: layer.get("y") + offset.y,
                    });
                }
            }

            setCanvasState({ mode: CanvasMode.Translating, current: point });

        }, [canvasState]);

        const unselectLayers = useMutation(({ self, setMyPresence }) => {
            if(self.presence.selection?.length && self.presence.selection.length > 0){
                setMyPresence({ selection: [] }, { addToHistory: true });
            }
        }, []);

        const updateSelectionNet = useMutation(
            ({ storage, setMyPresence }, current: Point, origin: Point) => {
                const liveLayers = storage.get("layers");
                const liveLayerIds = storage.get("layerIds");
                const layerMap = new Map(
                    Object.entries(liveLayers.toJSON() as Record<string, Layer>),
                );
                const orderedIds = Array.from(liveLayerIds);

                setCanvasState({
                    mode: CanvasMode.SelectionNet,
                    origin,
                    current,
                });

                const ids = findIntersectingLayersWithRectangle(
                    orderedIds,
                    layerMap,
                    origin,
                    current,
                );
                setMyPresence({ selection: ids });
            },
            [],
        );

        const startMultiSelect = useCallback(( current: Point, origin: Point) => {
            if(Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5){
                setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
            }
        }, []);

        const continueDrawing = useMutation(({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
            const { pencilDraft } = self.presence;

            if(canvasState.mode !== CanvasMode.Pencil || e.buttons !== 1 || pencilDraft == null) return;

            setMyPresence({
                cursor: point,
                pencilDraft: pencilDraft.length === 1 &&
                pencilDraft[0][0] === point.x &&
                pencilDraft[0][1] === point.y ?
                pencilDraft : [...pencilDraft, [point.x, point.y, e.pressure]],
            }, { addToHistory: false });
        }, [canvasState.mode]);

        const clearBoard = useMutation(({ storage, setMyPresence }) => {
            const liveLayers = storage.get("layers");
            const liveLayerIds = storage.get("layerIds");

            const ids = Array.from(liveLayerIds);
            for (const id of ids) {
                liveLayers.delete(id);
            }
            liveLayerIds.clear();
            setMyPresence({ selection: [], pencilDraft: null }, { addToHistory: true });
        }, []);

        const insertPath = useMutation(({ storage, self, setMyPresence }) => {
            const liveLayers = storage.get("layers");
            const { pencilDraft } = self.presence;

            if(pencilDraft == null || pencilDraft.length < 2 || liveLayers.size >= MAX_LAYERS){
                setMyPresence({ pencilDraft: null });
                return;
            }
            const id = nanoid();
            liveLayers.set(id, new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColors[LayerType.Path] ?? DEFAULT_COLOR)));

            const liveLayerIds = storage.get("layerIds");
            liveLayerIds.push(id);

            setMyPresence({ pencilDraft: null });
            setCanvasState({ mode: CanvasMode.Pencil });
        }, [DEFAULT_COLOR, lastUsedColors]);

        const startDrawing = useMutation(({ setMyPresence }, point: Point, pressure: number) => {
            setMyPresence({
                pencilDraft: [[point.x, point.y, pressure]],
                penColor: lastUsedColors[LayerType.Path] ?? DEFAULT_COLOR,
            })
        }, [DEFAULT_COLOR, lastUsedColors]);

        const resizeSelectedLayer = useMutation(({ storage, self }, point: Point) => {
            if (canvasState.mode !== CanvasMode.Resizing) return;

            const bounds = resizeBounds(canvasState.initial, point, canvasState.corner);

            const liveLayers = storage.get("layers");
            const layer = liveLayers.get(self.presence.selection?.[0] ?? "");

            if(layer){
                layer.update(bounds);
            }
        }, [canvasState]);

    const onResizeHandlePointerDown = useCallback((
        corner:Side, initialBounds: XYWH) => {
            history.pause();
            setCanvasState({ mode: CanvasMode.Resizing, initial: initialBounds, corner });
        }, [history]);

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

        if(canvasState.mode === CanvasMode.Pressing){
            startMultiSelect(current, canvasState.origin);
        }
        else if(canvasState.mode === CanvasMode.SelectionNet){
            updateSelectionNet(current, canvasState.origin);
        }
        else if(canvasState.mode === CanvasMode.Translating){
            TranslateSelectedLayers(current);
        } else if (canvasState.mode === CanvasMode.Resizing) {
            resizeSelectedLayer(current);
        } else if (canvasState.mode === CanvasMode.Pencil){
            continueDrawing(current, e);
        }

        setMyPresence({ cursor: current });
    }, [
        camera,
        canvasState,
        resizeSelectedLayer,
        TranslateSelectedLayers,
        updateSelectionNet,
        startMultiSelect,
        continueDrawing,
    ]);

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null });
    }, []);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        const point = pointertoCanvas(e, camera);

        if(canvasState.mode === CanvasMode.Inserting)   return;

        if(canvasState.mode === CanvasMode.Pencil){
            startDrawing(point, e.pressure);
            return;
        }

        setCanvasState({origin: point, mode: CanvasMode.Pressing});
        
    }, [canvasState.mode, camera, setCanvasState, startDrawing]);

    const onPointerUp = useMutation(({}, e) => {
        const point = pointertoCanvas(e, camera);

        if(canvasState.mode === CanvasMode.Pressing || canvasState.mode === CanvasMode.None){
            unselectLayers();
            setCanvasState({ mode: CanvasMode.None });
        } else if (canvasState.mode === CanvasMode.Pencil){
            insertPath();
        }
        else if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.layerType as (LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note), point);
        } else {
            setCanvasState({ mode: CanvasMode.None });
        }
        history.resume();
    }, [camera, canvasState, insertLayer, history, unselectLayers, insertPath, setCanvasState]);

    const selections = useOthersMapped((others) => others.presence.selection);

    const onLayerPointerDown = useMutation(({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
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
            data-board-canvas
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
                clearBoard={clearBoard}
                canUndo={canUndo}
                canRedo={canRedo}
            />
            <Formatter camera={camera} canvasState={canvasState} setLastUsedColorForType={setLastUsedColorForType} />
            <SelectionTools 
                camera = {camera}
                />
            <svg className="h-screen w-screen"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
                onPointerDown={onPointerDown}
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
                            onLayerPointerDown={(e) => onLayerPointerDown(e, layerId)}
                            selectionColor={layerIdstoColor[layerId] ?? null}
                        />
                    ))}
                    <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown}/>
                    {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
                        <rect 
                            className="fill-neutral-500/10 stroke-neutral-800 opacity-75"
                            strokeWidth={1.5}
                            strokeDasharray="6 3"
                            x={Math.min(canvasState.origin.x, canvasState.current.x)}
                            y={Math.min(canvasState.origin.y, canvasState.current.y)}
                            width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                            height={Math.abs(canvasState.origin.y - canvasState.current.y)}
                        />
                    )}
                    <CursorPresence />
                    { pencilDraft != null && pencilDraft.length > 0 && (
                        <Path
                            x={0}
                            y={0}
                            points={pencilDraft}
                            fill={colourToCSS(lastUsedColors[LayerType.Path] ?? DEFAULT_COLOR)}
                            onPointerDown={() => {}}
                        />
                    )}
                </g>
            </svg>
        </main>
    );
};