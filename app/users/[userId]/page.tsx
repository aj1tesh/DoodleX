interface UserPageProps {
    params: Promise<{
        userId: string
    }>
}

const UserPage = async ({ params }: UserPageProps) => {
    const { userId } = await params;
    return (
        <div>
            User Id : {userId}
        </div>
    )
}

export default UserPage;