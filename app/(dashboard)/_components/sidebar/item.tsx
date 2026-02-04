"use client";

import Image from "next/image";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
    id: string;
    name: string;
    imageUrl: string;
}

export const SidebarItem = ({ id, name, imageUrl }: SidebarItemProps) => {
    const { organization } = useOrganization();
    const { setActive } = useOrganizationList();

    const isActive = organization?.id === id;
    const onClick = () => {
        if(!setActive) return;
        setActive({ organization: id });
    }

    return (
        <div className="aspect-square relative">
            <Image
                src={imageUrl}
                alt={name}
                onClick={onClick}
                fill
                className={cn("cursor-pointer opacity-75 hover:opacity-100 transition", isActive && "opacity-100")}
            />
        </div>
    )
}