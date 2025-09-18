import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";
import { getRecevierSocketId } from "../utiles/socket.js";
import { io } from "../utiles/socket.js";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    const filteredUsers = await User.find({ _id: { $ne: user._id } }).select("-password");

    res.status(200).json({
        success: true,
        users: filteredUsers,
    });

});

export const getMessages = catchAsyncError(async (req, res, next) => {
    const receiverId = req.params.id;
    const myId = req.user._id;

    const receiver = await User.findById(receiverId);

    if (!receiver) {
        return res.status(400).json({
            success: false,
            message: "Reciver ID invalid."
        });
    }

    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: receiverId },
            { senderId: receiverId, receiverId: myId },
        ],
    }).sort({ createdAt: 1 });


    res.status(200).json({
        success: true,
        messages
    })
});

export const sendMessage = catchAsyncError(async (req, res, next) => {
    const { text } = req.body;
    const media = req?.files?.media;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const receiver = await User.findById(receiverId);

    if (!receiver) {
        return res.status(400).json({
            success: false,
            message: "Reciver ID invalid."
        });
    }

    const sanitizedText = text?.trim() || "";

    if (!sanitizedText && !media) {
        return res.status(400).json({
            success: false,
            message: "Cannot send empty message."
        });
    }

    let mediaUrl = "";

    if (media) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(
                media.tempFilePath, {
                resource_type: "auto", //auto_detect image/video
                folder: "CHAT_APP_MEDIA",
                transformation: [
                    { width: 1080, height: 1080, crop: "limit" },
                    { quality: "auto" },
                    { fetch_format: "auto" },
                ],
            }
            );
            mediaUrl = uploadResponse?.secure_url;
        } catch (error) {
            console.error("Clodinary upload error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to upload media. Please try again."
            });
        }
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        text: sanitizedText,
        media: mediaUrl,
    });

    const recevierSocketId = getRecevierSocketId(receiverId);
    if (recevierSocketId) {
        io.to(recevierSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage);
});
