"use client";

import { Plus } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Hint } from "@/components/hint";

export const NewButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="aspect-square">
                    <Hint 
                    label="Create Organization"
                    side="right"
                    align="center"
                    sideOffset={10}
                    alignOffset={10}
                    >
                        <button className="w-full h-full flex items-center justify-center bg-blue-950 rounded-md
                        hover:opacity-80 transition">
                            <Plus className="text-white" />
                        </button>
                    </Hint>
                </div>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
                <DialogTitle className="sr-only">Create Organization</DialogTitle>
                <CreateOrganization />
            </DialogContent>
        </Dialog>
    )
}