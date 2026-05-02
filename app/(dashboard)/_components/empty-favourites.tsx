import Image from "next/image";

export const EmptyFavourites = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Image src="/empty-search.svg" alt="Empty Favourites" width={140} height={140} />
            <h2 className="text-2xl font-bold">No favorite boards found</h2>
            <p className="text-sm text-muted-foreground">Add some boards to your favorites to see them here</p>
        </div>
    )
}