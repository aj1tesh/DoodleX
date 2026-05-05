import { Loader } from "lucide-react";
import { Info } from "./info";  
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";

export const Loading = () => {
    return (
        <div className="h-full w-full relative bg-neutral-100 touch-none flex items-center justify-center">
            <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            <Info.Skeleton />
            <Participants.Skeleton />
            <Toolbar.Skeleton />
        </div>
    );
};