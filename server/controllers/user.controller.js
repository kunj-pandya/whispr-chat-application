import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJWTToken } from "../utiles/jwtToken.js";
import { v2 as cloudinary } from "cloudinary";

export const signup = catchAsyncError(async (req, res, next) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide complete details."
        });
    };

    const emailRegx = /^\S+@\S+\.\S+$/;

    if (!emailRegx.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Email Format."
        });
    };

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be 8 Characters long."
        });
    };

    const isEmailAlreadyUsed = await User.findOne({ email });

    if (isEmailAlreadyUsed) {
        return res.status(400).json({
            success: false,
            message: "Email is already registered."
        });
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullname,
        email,
        password: hashedPassword,
        avatar: {
            public_id: "",
            url: ""
        },
    });

    generateJWTToken(user, "User registered successfully", 201, res);

});

export const signin = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide email and password.",
        });
    };

    const emailRegx = /^\S+@\S+\.\S+$/;

    if (!emailRegx.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Email Format."
        });
    };

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid Credentials no user found.",
        });
    };

    const IsPasswordMatched = await bcrypt.compare(password, user.password);
    if (!IsPasswordMatched) {
        return res.status(400).json({
            success: false,
            message: "Invalid Credentials.",
        });
    };

    generateJWTToken(user, "user logged in successfully", 200, res);

});

export const signout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        httpOnly: true,
        maxAge: 0,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development" ? true : false,
    })
        .json({
            success: true,
            message: "User loggeed out successfully.",
        });
});

export const getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    // const user = req.user;

    res.status(200).json({
        success: true,
        user
    });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
    const { fullname, email } = req.body;

    if (fullname.trim().length === 0 || email.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "Fullname and Email can't be empty."
        });
    };

    const avatar = req?.files?.avatar;

    let cloudinaryReponse = {};

    if (avatar) {
        try {
            const oldAvatarPublicId = req.user?.avatar?.public_id;

            if (oldAvatarPublicId && oldAvatarPublicId.length > 0) {
                await cloudinary.uploader.destroy(oldAvatarPublicId)
            }

            cloudinaryReponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
                folder: "CHAT_APP_USERS_AVATARS",
                transformation: [
                    { width: 300, height: 300, crop: "limit" },
                    { quality: "auto" },
                    { fetch_format: "auto" }
                ],
            });

        } catch (error) {
            console.error("Clodinary upload error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to upload avatar. Please try again."
            })
        }
    }
    let data = {
        fullname,
        email,
    };

    if (avatar && cloudinaryReponse?.public_id && cloudinaryReponse?.secure_url) {
        data.avatar = {
            public_id: cloudinaryReponse.public_id,
            url: cloudinaryReponse.secure_url,
        };
    }

    let user = await User.findByIdAndUpdate(req.user._id, data, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user,
    });

});
