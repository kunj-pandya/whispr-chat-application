import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

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

});
