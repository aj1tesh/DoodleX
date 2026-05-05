"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";

interface ToolButtonProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    isActive?: boolean;
    isDisabled?: boolean;
}

export const ToolButton = ({ icon:Icon, label, onClick, isActive, isDisabled }: ToolButtonProps) => {
    return (
        <Hint label={label} side="right" sideOffset={14}>
            <Button variant={isActive ? "boardActive" : "board"}
                onClick={onClick} 
                disabled={isDisabled}
                className="size-8">
                <Icon />
            </Button>
        </Hint>
    )
}