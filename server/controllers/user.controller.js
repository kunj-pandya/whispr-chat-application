import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJWTToken } from "../utiles/jwtToken.js";

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

export const signin = catchAsyncError(async (req, res, next) => { });

export const signout = catchAsyncError(async (req, res, next) => { });

export const getUser = catchAsyncError(async (req, res, next) => { });

export const updateProfile = catchAsyncError(async (req, res, next) => { });
