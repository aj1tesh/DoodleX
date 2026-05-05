import { Eraser, Pencil, RedoIcon, TrashIcon, TypeIcon, UndoIcon } from "lucide-react";
import { ToolButton } from "./tool-button";
import { BoxSelectIcon, MousePointer2Icon } from "lucide-react";

export const Toolbar = () => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            <div className="bg-white rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md">
                <ToolButton
                    icon={BoxSelectIcon}
                    label="Select Box"
                    onClick={() => {}}
                    isActive={false}
                    isDisabled={false}
                />
                <ToolButton
                    icon={MousePointer2Icon}
                    label="Select"
                    onClick={() => {}}
                    isActive={false}
                    isDisabled={false}
                />
                <ToolButton
                    icon={TypeIcon}
                    label="Type"
                    onClick={() => {}}
                    isActive={false}
                    isDisabled={false}
                />
                <ToolButton
                    icon={Pencil}
                    label="Pencil"
                    onClick={() => {}}
                    isActive={false}
                    isDisabled={false}
                />
                <ToolButton
                    icon={Eraser}
                    label="Eraser"
                    onClick={() => {}}
                    isActive={false}
                    isDisabled={false}
                />
            </div>
            <div className="bg-white rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md">
                <ToolButton
                    icon={UndoIcon}
                    label="Undo"
                    onClick={() => {}}
                    isActive={false}
                    isDisabled={false}
                />
                <ToolButton
                    icon={RedoIcon}
                    label="Redo"
                    onClick={() => {}}
                    isActive={false}
                    isDisabled={false}
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