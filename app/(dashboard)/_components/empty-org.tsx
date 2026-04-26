import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CreateOrganization } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const EmptyOrg = () => {
    return (
        <div className='flex-1 h-full flex flex-col items-center justify-center'>
            <Image src="/wai.jpg" alt="Empty Organization" width={200} height={200} className="rounded-md" />
            <h1 className='text-2xl font-bold'>No Doodle Societies Found</h1>
            <p className='text-sm text-gray-500'>Create a new Doodle Organization to get started</p>

            <div className="mt-6">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="mt-6 bg-blue-950 hover:bg-blue-950/90">Create Organization</Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
                        <DialogTitle className="sr-only">Create Organization</DialogTitle>
                        <CreateOrganization />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}