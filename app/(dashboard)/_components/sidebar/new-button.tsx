"use client";

import { Plus } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const NewButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="aspect-square">
                    <button className="w-full h-full flex items-center justify-center bg-blue-950 rounded-md
                    hover:opacity-80 transition">
                        <Plus className="text-white" />
                    </button>
                </div>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
                <CreateOrganization />
            </DialogContent>
        </Dialog>
    )
}