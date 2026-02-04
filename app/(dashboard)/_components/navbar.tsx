"use client";

import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
    return (
        <div className="h-16 border-b bg-green-300 flex items-center px-4">
            <div className="hidden lg:flex lg:flex-1">
                {/* Add Search Bar */}
            </div> 
            <UserButton />
        </div>
    )
}