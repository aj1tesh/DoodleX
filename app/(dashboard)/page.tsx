"use client";

import { EmptyOrg } from './_components/empty-org';
import { useOrganization } from '@clerk/nextjs';

const DashboardPage = () => {
    const { organization } = useOrganization();

    return (
        <div className='flex-1 h-[calc(100%-80px)] p-6'>
            {!organization ? <EmptyOrg /> : <p>Board List goes here</p>}
        </div>
    ) 
}

export default DashboardPage