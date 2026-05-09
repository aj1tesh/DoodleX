"use client";

import { useState } from "react";
import { PencilIcon, RedoIcon, TrashIcon, TypeIcon, UndoIcon, MousePointer2Icon, SquareIcon, CircleIcon, StickyNoteIcon } from "lucide-react";
import { ToolButton } from "./tool-button";
import { BoardSummarizer } from "./board-summarizer";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (state: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    clearBoard: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const Toolbar = ({ canvasState, setCanvasState, undo, redo, clearBoard, canUndo, canRedo }: ToolbarProps) => {
    const [clearDialogOpen, setClearDialogOpen] = useState(false);

    return (
        <>
            <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
                <div className="bg-white rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md">
                    <ToolButton
                        icon={MousePointer2Icon}
                        label="Select"
                        onClick={() => {
                            setCanvasState({ mode: CanvasMode.None });
                        }}
                        isActive={
                            canvasState.mode === CanvasMode.None ||
                            canvasState.mode === CanvasMode.Pressing ||
                            canvasState.mode === CanvasMode.SelectionNet ||
                            canvasState.mode === CanvasMode.Translating ||
                            canvasState.mode === CanvasMode.Resizing
                        }
                    />
                    <ToolButton
                        icon={TypeIcon}
                        label="Type"
                        onClick={() => {
                            setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Text });
                        }}
                        isActive={
                            canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text
                        }
                    />
                    <ToolButton
                        icon={PencilIcon}
                        label="Pen"
                        onClick={() => {
                            setCanvasState({ mode: CanvasMode.Pencil });
                        }}
                        isActive={
                            canvasState.mode === CanvasMode.Pencil
                        }
                    />
                    <ToolButton
                        icon={SquareIcon}
                        label="Square"
                        onClick={() => {
                            setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Rectangle });
                        }}
                        isActive={
                            canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle
                        }
                    />
                    <ToolButton
                        icon={CircleIcon}
                        label="Circle"
                        onClick={() => {
                            setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Ellipse });
                        }}
                        isActive={
                            canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse
                        }
                    />
                    <ToolButton
                        icon={StickyNoteIcon}
                        label="Sticky Note"
                        onClick={() => {
                            setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Note });
                        }}
                        isActive={
                            canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Note
                        }
                    />
                </div>
                <div className="bg-white rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md">
                    <ToolButton
                        icon={UndoIcon}
                        label="Undo"
                        onClick={undo}
                        isDisabled={!canUndo}
                    />
                    <ToolButton
                        icon={RedoIcon}
                        label="Redo"
                        onClick={redo}
                        isDisabled={!canRedo}
                    />
                    <ToolButton
                        icon={TrashIcon}
                        label="Clear Board"
                        onClick={() => setClearDialogOpen(true)}
                        isActive={false}
                        isDisabled={false}
                    />
                </div>
                <div className="bg-white rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md">
                    <BoardSummarizer />
                </div>
            </div>
            <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Clear the board?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This removes all layers on the board for everyone in this room. This can be undone with the undo button.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="cursor-pointer bg-black text-white hover:bg-black/90 focus-visible:ring-black/20 dark:bg-black dark:hover:bg-black/90"
                            onClick={() => clearBoard()}
                        >
                            Clear board
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export const ToolbarSkeleton = () => {
    return (
        <div className="absolute rounded-md top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[420px] w-[52px] shadow-md" />
    );
};
