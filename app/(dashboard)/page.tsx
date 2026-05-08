"use client";

import { EmptyOrg } from './_components/empty-org';
import { useOrganization } from '@clerk/nextjs';
import { BoardList } from "./_components/sidebar/board-list";
import { useSearchParams } from "next/navigation";

const DashboardPage = () => {
    const { organization } = useOrganization();
    const searchParams = useSearchParams();
    const search = searchParams.get("search") ?? undefined;
    const favorite = searchParams.get("favorite") ?? undefined;

    return (
        <div className='flex-1 h-[calc(100%-80px)] p-6'>
            {!organization ? <EmptyOrg /> : (
                <BoardList 
                    orgId={organization.id}
                    query={{
                        search,
                        favorite,
                    }}
                />
            )}
        </div>
    ) 
}

export default DashboardPage
