import { NewButton } from "./new-button";
import { OrgList } from "./list";

export const Sidebar = () => {
    return (
        <aside className="text-white fixed z-1 left-0 top-0 bg-blue-950 h-full w-[60px] flex p-3 flex-col gap-y-4">
            <OrgList />
            <NewButton /> 
        </aside>
    )
}