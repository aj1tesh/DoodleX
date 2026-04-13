"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { SearchInput } from "./search-input";

export const Navbar = () => {
    return (
        <div className="h-16 border-b flex items-center px-4">
            <div className="hidden lg:flex lg:flex-1">
                <SearchInput />
            </div>
            <div className="block lg:hidden flex-1">
            <OrganizationSwitcher
                hidePersonal
                appearance={{
                    elements: {
                        rootBox: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            maxWidth: "367px",
                        },
                        organizationSwitcherTrigger: {
                            padding: "6px",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: "white",
                        },
                    },
                }}
            />
            </div>
            <UserButton />
        </div>
    )
}