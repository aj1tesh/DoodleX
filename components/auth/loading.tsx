import Image from "next/image";

export const Loading = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            <Image
                src="/logo1.png"
                alt="DoodleX logo"
                width={120}
                height={120}
                priority
                className="animate-pulse duration-700"
            />
        </div>
    );
}