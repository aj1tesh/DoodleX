"use client";

import { OrganizationSwitcher, UserButton, useOrganization } from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { InviteButton } from "./invite-button";

export const Navbar = () => {
    const { organization } = useOrganization();
    
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
                            maxWidth: "376px",
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
            {organization && (
                <div className="-translate-x-5 shrink-0">
                    <InviteButton />
                </div>
            )}
            <UserButton />
        </div>
    )
}