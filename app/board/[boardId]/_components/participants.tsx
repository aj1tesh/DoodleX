"use client";

import { getColor } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";
import { useOthers, useSelf } from "@liveblocks/react/suspense";

const MAX_USERS = 3;

export const Participants = () => {
    const users = useOthers();
    const currentUser = useSelf();
    const hasMoreUsers = users.length > MAX_USERS;

    return (
        <div className="absolute top-2 right-2 bg-white rounded-md p-3 h-12 flex items-center shadow-md">
            <div className="flex gap-x-2">
                {users.slice(0, MAX_USERS).map(({ connectionId, info }) => {
                    const displayName = info?.name?.trim() || "Anonymous";
                    return (
                        <UserAvatar
                            borderColor={getColor(connectionId)}
                            key={connectionId}
                            src={info?.picture}
                            name={displayName}
                            fallback={displayName.charAt(0).toUpperCase()}
                        />
                    );
                })}

                {currentUser && (() => {
                    const selfName = currentUser.info?.name?.trim() || "You";
                    return (
                        <UserAvatar
                            borderColor={getColor(currentUser.connectionId)}
                            src={currentUser.info?.picture}
                            name={`${selfName} (You)`}
                            fallback={selfName.charAt(0).toUpperCase()}
                        />
                    );
                })()}

                {hasMoreUsers && (
                    <UserAvatar
                        borderColor={getColor(users.length - MAX_USERS)}
                        name={`+${users.length - MAX_USERS} more`}
                        fallback={`+${users.length - MAX_USERS}`}
                    />
                )}

            </div>
        </div>
    );
};

export const ParticipantsSkeleton = () => {
    return (
        <div className="absolute rounded-md top-2 right-2 bg-white p-3 h-12 flex items-center shadow-md w-[100px]" />
    );
};