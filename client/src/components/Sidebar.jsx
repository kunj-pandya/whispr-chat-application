import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { getUsers, setSelectedUser } from "../store/slices/chatSlice";
import { Users } from "lucide-react";

const Sidebar = () => {
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const { users, selectedUser, isUsersLoading } = useSelector((state) => state.chat);
    const { onlineUsers } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    const filteredUsers = showOnlineOnly ? users?.filter((u) => onlineUsers.includes(u._id)) : users;

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-gray-200 flex flex-col transition-all duration-200 bg-white">

            {/* ------------------- HEADER -------------------- */}

            <div className="border-b border-gray-200 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-gray-700" />
                    <span className="font-medium hidden lg:block text-gray-800">
                        Contacts
                    </span>
                </div>

                {/* -------------------ONLINE ONLY FILTER------------- */}
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="w-4 h-4 border-gray-700 text-blue-600 foucs:ring-blue-500"
                        />
                        Show Online Only
                    </label>
                    <span className="text-xs text-gray-500">
                        ({onlineUsers?.length ? onlineUsers.length - 1 : 0}online)
                    </span>
                </div>
            </div>

        </aside>
    );
};

export default Sidebar;
