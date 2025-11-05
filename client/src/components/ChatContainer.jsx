import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../store/slices/chatSlice";
import { getSocket } from "../lib/socket";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader"

const ChatContainer = () => {

    const { message, isMessagesLoading, selectedUser } = useSelector(state => state.chat);

    const { authUser } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const messageEndRef = useRef(null);

    useEffect(() => {
        dispatch(getMessages(selectedUser._id))
    }, [dispatch, selectedUser._id])

    useEffect(() => {
        if (messageEndRef.current && message) {
            message.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [message]);
    // scrooll as new message comes(new content)

    function formatMessageTime(date) {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        })
    }

    useEffect(() => {
        if (!selectedUser?._id) return;

        dispatch(getMessages(selectedUser._id));

        const socket = getSocket();

        if (!socket) return;
    }, [dispatch, selectedUser?._id]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        )
    }


    return (<>
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <ChatHeader />


            {/* ------------Messages-------------- */}

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {
                    message.length > 0 && message.map((msg, index) => {

                        const isSender = msg.senderId === authUser._id;

                        return (
                            <div
                                key={msg._id}
                                className={`flex items-end ${isSender ? "justify-end" : "justify-start"}`}
                                ref={index === msg.length - 1 ? messageEndRef : null}
                            >
                                {/* --------------------------avavatr----------------- */}

                                <div
                                    className={`w-10 h-10 rounded-full overflow-hidden border shrink-0 ${isSender ? "order-2 ml-3" : "order-1 mr-3"}`}
                                >
                                    <img
                                        src={selectedUser?.avatar?.url || "/avatar-holder.avif"}
                                        alt="/avatar-holder.avif"
                                        className="w-full h-full object-cover"

                                    />
                                </div>


                                {/* ---------------BUBBLE----------------- */}
                                <div
                                    className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-xl text-sm ${isSender ? "bg-blue-400/20 text-black order-1" : "bg-gray-200 text-black order-2"}`}
                                >


                                    {
                                        msg.media && (
                                            <>
                                                {
                                                    msg.media.includes(".mp4") || msg.media.includes(".webm") || msg.media.includes(".mov") ? (
                                                        <video src={msg.media} controls className="w-full rounded-md mb-2" />
                                                    ) : (
                                                        <img src={msg.media} alt="Attachment" className="w-full rounded-md mb-2" />
                                                    )
                                                }
                                            </>
                                        )
                                    }

                                    {msg.text && <p>{msg.text}</p>}

                                    <span className="block text-[10px] mt-1 text-right text-gar-400">
                                        {formatMessageTime(msg.createdAt)}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <MessageInput />
        </div>

    </>
    );
};

export default ChatContainer;
