import Image from "next/image";

export const EmptyBoards = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Image src="/empty-search.svg" alt="Empty Boards" width={140} height={140} />
            <h2 className="text-2xl font-bold">No boards found</h2>
            <p className="text-sm text-muted-foreground">Create a new board to get started</p>
        </div>
    )
}