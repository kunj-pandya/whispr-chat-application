import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import { User } from "../models/user.model.js";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    const filteredUsers = await User.find({ _id: { $ne: user._id } }).select("-password");

    res.status(200).json({
        success: true,
        users: filteredUsers,
    });

});

export const getMessages = catchAsyncError(async (req, res, next) => {

});

export const sendMessage = catchAsyncError(async (req, res, next) => {

});
