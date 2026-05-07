import { Canvas } from "./_components/canvas";
import { Room } from "@/components/room";
import { notFound } from "next/navigation";
import { Loading } from "./_components/loading";

interface BoardIdPageProps {
    params: Promise<{
        boardId: string;
    }>;
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
    //return <Loading />;

    const { boardId } = await params;

    if (!boardId) {
        notFound();
    }

    return (
        <Room roomId={boardId} fallback={<Loading />}>
            <Canvas boardId={boardId} />
        </Room>
    );
};

export default BoardIdPage;