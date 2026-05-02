import Image from "next/image";

export const EmptySearch = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Image src="/empty-search.svg" alt="Empty Search" width={140} height={140} />
            <h2 className="text-2xl font-bold">No boards match your search</h2>
            <p className="text-sm text-muted-foreground">Try searching for something else</p>
        </div>
    )
}