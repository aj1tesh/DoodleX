"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Hint } from "@/components/hint";
import { useRenameModal } from "@/store/use-rename-modal";
import { Actions } from "@/components/actions";
import { Menu } from "lucide-react";

interface InfoProps {
    boardId: Id<"boards">;
}

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

const TabSeparator = () => {
    return (
        <div className="text-neutral-300 px-1.5">
            |
        </div>
    );
};

export const Info = ({ boardId }: InfoProps) => {
    const { onOpen } = useRenameModal();

    const data = useQuery(api.board.get, { id: boardId as Id<"boards"> });

    if (!data) return <InfoSkeleton />;

    return (
        <div className="absolute top-2 left-2 bg-white px-1.5 rounded-md h-12 flex items-center shadow-md">
            <Hint label="Go to Home" align="center" sideOffset={10} alignOffset={10}>
                <Button variant="board" className=" rounded-md" asChild>
                    <Link href="/">
                        <Image src="/logo1.png" alt="logo" width={90} height={90} className="h-12 w-12" />
                        <span className={cn(
                                "text-xl ml-2 font-semibold text-black",
                                font.className
                            )}>Board</span>
                    </Link>
                </Button>
            </Hint>
            <TabSeparator />
            <Hint label="Rename Board" align="center" sideOffset={10} alignOffset={10}>
                <Button variant="board" className=" rounded-md px-2 text-md font-semibold" 
                onClick={() => onOpen(boardId,data.title)}>
                    {data.title}
                </Button>
            </Hint>
            <TabSeparator />
            <Hint label="Main Menu" side="bottom" sideOffset={10}>
                <div>
                    <Actions
                        id={boardId}
                        title={data.title}
                        side="bottom"
                        sideOffset={10}
                    >
                        <Button size="icon" variant="board">
                            <Menu />
                        </Button>
                    </Actions>
                </div>
            </Hint>
        </div>
    );
};

export const InfoSkeleton = () => {
    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]" />
    );
};