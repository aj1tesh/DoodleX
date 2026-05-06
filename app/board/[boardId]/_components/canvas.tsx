"use client";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { Id } from "@/convex/_generated/dataModel";
import { CanvasMode, CanvasState } from "@/types/canvas";
import { useCallback, useState } from "react";
import { useHistory, useCanUndo, useCanRedo, useMutation } from "@liveblocks/react";
import { CursorPresence } from "./cursor-presence";
import { Camera } from "@/types/canvas";
import { pointertoCanvas } from "@/lib/utils";


const MAX_LAYERS = 100;
interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
    const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });

    const [ camera, setCamera ] = useState<Camera>({ position: { x: 0, y: 0 } });

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

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
            >
                <g
                style={{
                    transform: `translate(${camera.position.x}px, ${camera.position.y}px)`,
                }}
                >
                    <CursorPresence />
                </g>
            </svg>
        </main>
    );
};