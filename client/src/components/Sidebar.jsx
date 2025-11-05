import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { getUsers, setSelectedUser } from "../store/slices/chatSlice";
import { Users } from "lucide-react";

const Sidebar = () => {
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const { users, selectedUser, isUsersLoading } = useSelector((state) => state.chat);
    const { onlineUsers, authUser } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        if (authUser) {
            dispatch(getUsers());
        }
    }, [dispatch, authUser]);

    const filteredUsers = users
        ?.filter((user) => user._id !== authUser?._id)
        ?.filter((user) => (showOnlineOnly ? onlineUsers.includes(user._id) : true));

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
                        ({onlineUsers?.length || 0} online)
                    </span>
                </div>
            </div>

            {/* -------------------- USERS LIST----------------  */}

            <div className="overflow-y-auto w-full py-3">

                {
                    filteredUsers.length > 0 && filteredUsers.map(user => (
                        <button
                            key={user._id}
                            onClick={() => dispatch(setSelectedUser(user))}
                            className={`w-full p-3 flex items-center gap-3 transition-colors rounded-md ${selectedUser?._id === user._id ? "bg-gray-200 ring-gray-200" : "hover:bg-gray-200"
                                }`}
                        >

                            {/* ---------- AVATAR --------- */}
                            <div className="relative mx-auto lg:mx-0">
                                <img
                                    src={user?.avatar?.url || "/avatar-holder.avif"}
                                    alt={"/avatar-holder.avif"}
                                    className="w-12 h-12 object-cover rounded-full"
                                />
                                {
                                    onlineUsers.includes(user._id) && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />)
                                }
                            </div>
                            {/* --------- USER INFO ------------ */}
                            <div className="hidden lg:block text-left min-w-0">
                                <div className="font-medium text-gray-800 truncate">
                                    {user.fullname}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                </div>
                            </div>

                        </button>
                    ))
                }


                {
                    filteredUsers?.length === 0 && (
                        <div className="text-center text-gray-500 py-4">
                            No Online Users
                        </div>
                    )
                }

            </div>
        </aside>
    );
};

export default Sidebar;
