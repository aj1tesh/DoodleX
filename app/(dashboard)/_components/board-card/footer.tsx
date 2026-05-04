import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FooterProps {
    title: string;
    authorLabel: string;
    createdAtLabel: string;
    isFavorite: boolean;
    onClick: () => void;
    disabled: boolean;
};

export const Footer = ({ title, authorLabel, createdAtLabel, isFavorite, onClick, disabled }: FooterProps) => {
    return (
        <div className="relative p-3 bg-white">
            <p className="text-sm font-medium truncate max-w-[calc(100% - 20px)]">{title}</p>
            <p className="text-sm text-muted-foreground truncate max-w-[calc(100% - 20px)]">{authorLabel} • {createdAtLabel}</p>
            <Button variant="ghost" size="icon" onClick={onClick} disabled={disabled}
                className={cn("absolute top-3 right-3", isFavorite && "text-yellow-400")}
            >
                <StarIcon className={cn("size-3.5", isFavorite ? "fill-yellow-400 text-yellow-400" : "fill-none")} />
            </Button>
        </div>
    )
}