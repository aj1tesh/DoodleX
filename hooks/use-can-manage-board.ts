"use client";

import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { useMemo } from "react";

const ADMIN_ROLES = new Set(["org:admin", "admin"]);

export function useCanManageBoard(
    board: { authorId: string; orgId: string } | null | undefined,
) {
    const { userId } = useAuth();
    const { userMemberships } = useOrganizationList({
        userMemberships: { infinite: true },
    });

    return useMemo(() => {
        if (!board || !userId) return false;
        if (board.authorId === userId) return true;
        const m = userMemberships.data?.find(
            (x) => x.organization.id === board.orgId,
        );
        const role = m?.role;
        return role != null && ADMIN_ROLES.has(role);
    }, [board, userId, userMemberships.data]);
}
