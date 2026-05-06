import { PencilIcon, RedoIcon, TrashIcon, TypeIcon, UndoIcon, MousePointer2Icon, SquareIcon, CircleIcon, StickyNoteIcon } from "lucide-react";
import { ToolButton } from "./tool-button";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

interface ToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (state: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const Toolbar = ({ canvasState, setCanvasState, undo, redo, canUndo, canRedo }: ToolbarProps) => {
    return (
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
                    label="Delete"
                    onClick={() => {}}
                    isActive={false}
                    isDisabled={false}
                />
            </div>
        </div>
    );
};

export const ToolbarSkeleton = () => {
    return (
        <div className="absolute rounded-md top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md" />
    );
};